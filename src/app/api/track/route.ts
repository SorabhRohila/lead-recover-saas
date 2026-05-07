import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const payload = JSON.parse(body);
    const { client_id, source_url, data } = payload;

    if (!client_id || !data || !source_url) {
      return NextResponse.json({ error: "Missing data" }, { status: 400, headers: corsHeaders });
    }

    const phone = data.phone || data.tel || data.phoneNumber || data.email || "Captured Lead";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch the user's registered website URL
    const { data: activePage } = await supabase
      .from('active_pages')
      .select('url, google_sheet_id')
      .eq('user_id', client_id)
      .single();

    if (!activePage || !activePage.url) {
      return NextResponse.json({ error: "No registered website found." }, { status: 403, headers: corsHeaders });
    }

    // 2. SECURITY CHECK: Ensure the domains match exactly!
    // This extracts just "yourwebsite.com" from the URLs and compares them
    const registeredDomain = new URL(activePage.url.startsWith('http') ? activePage.url : `https://${activePage.url}`).hostname;
    const incomingDomain = new URL(source_url.startsWith('http') ? source_url : `https://${source_url}`).hostname;

    if (registeredDomain !== incomingDomain && incomingDomain !== "localhost") {
      console.log(`Blocked: Registered ${registeredDomain} but received from ${incomingDomain}`);
      return NextResponse.json({ error: "Unauthorized website." }, { status: 403, headers: corsHeaders });
    }

            // 3. Domains match! Bulletproof Upsert Logic
    const sessionId = data.lr_session_id;
    let existingLeadId = null;

    if (sessionId) {
      // Fetch the most recent leads for this user manually
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, form_data')
        .eq('user_id', client_id)
        .eq('source_url', source_url)
        .order('created_at', { ascending: false })
        .limit(10);

      // Let JavaScript find the matching session ID
            // Let JavaScript find the matching session ID (Even if database stores it as text!)
      if (recentLeads) {
        const match = recentLeads.find((lead: any) => {
          let fd = lead.form_data;
          // If the database returns plain text, parse it into an object first
          if (typeof fd === 'string') {
            try { fd = JSON.parse(fd); } catch (e) {}
          }
          return fd && fd.lr_session_id === sessionId;
        });

        if (match) {
          existingLeadId = match.id;
        }
      }
    }

    if (existingLeadId) {
      // It exists! UPDATE the existing row
      const { error } = await supabase.from('leads')
        .update({ phone_number: phone, form_data: data })
        .eq('id', existingLeadId);
      if (error) throw error;
    } else {
      // First time! INSERT a new row
      const { error } = await supabase.from('leads').insert([{
        user_id: client_id,
        source_url: source_url,
        phone_number: phone, 
        form_data: data
      }]);
      if (error) throw error;
    }

    // 4. Push to Google Sheets (if connected)
    if (activePage.google_sheet_id && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const rowData = [new Date().toLocaleString(), phone, source_url, JSON.stringify(data)];

        await sheets.spreadsheets.values.append({
          spreadsheetId: activePage.google_sheet_id,
          range: 'Sheet1!A:D',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [rowData] },
        });
      } catch (sheetError) {
        console.error("Google Sheets Error:", sheetError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
  }
}