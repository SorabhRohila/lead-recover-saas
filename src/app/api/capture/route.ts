import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Allow any website to send leads to this API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle Preflight requests (Browsers do this automatically before sending POST data)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { account_id, session_id, form_data, phone_number, url } = body;

    if (!account_id || !phone_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
    }

    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("session_id", session_id)
      .eq("user_id", account_id)
      .single();

    if (existingLead) {
      await supabase.from("leads").update({
        form_data, phone_number, updated_at: new Date().toISOString()
      }).eq("id", existingLead.id);
    } else {
      await supabase.from("leads").insert([{
        user_id: account_id, session_id, form_data, phone_number, status: "abandoned", source_url: url
      }]);

      const { data: page } = await supabase.from("active_pages").select("google_sheet_id").eq("user_id", account_id).single();
      
      if (page && page.google_sheet_id) {
        try {
          const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_CLIENT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
          const sheets = google.sheets({ version: 'v4', auth });
          await sheets.spreadsheets.values.append({
            spreadsheetId: page.google_sheet_id,
            range: 'Sheet1!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[new Date().toLocaleString(), phone_number, JSON.stringify(form_data), url]] }
          });
        } catch (sheetErr) {
          console.error("Google Sheets Error:", sheetErr);
        }
      }
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders });
  }
}