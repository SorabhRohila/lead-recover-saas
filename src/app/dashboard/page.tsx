"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [activePages, setActivePages] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setUser(session.user);

      const { data: pages } = await supabase.from("active_pages").select("*").eq("user_id", session.user.id);
      if (pages) setActivePages(pages);

      const { data: userLeads } = await supabase.from("leads").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      if (userLeads) setLeads(userLeads);
      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  const handleAddUrl = async () => {
    if (!newUrl) return;
    const { error } = await supabase.from("active_pages").insert([{ user_id: user.id, url: newUrl }]);
    if (!error) {
      setActivePages([{ url: newUrl }]);
      setNewUrl("");
    }
  };

  const handleConnectSheet = async () => {
    if (!sheetUrl) return;
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const sheetId = match ? match[1] : sheetUrl;

    const { error } = await supabase.from("active_pages").update({ google_sheet_id: sheetId }).eq("user_id", user.id);
    if (!error) {
      setActivePages([{ ...activePages[0], google_sheet_id: sheetId }]);
      setSheetUrl("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

    const copyScript = () => {
    const scriptText = `<script src="${window.location.origin}/lr.js" data-account="${user?.id}" defer></script>`;
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-sm text-zinc-500 font-sans">Loading workspace...</div>;

  const activePage = activePages.length > 0 ? activePages[0] : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Premium Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-zinc-900 to-zinc-700 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tighter">LR</span>
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900">LeadRecover</span>
            <span className="text-zinc-300 mx-1">/</span>
            <span className="text-sm text-zinc-500 font-medium">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Overview</h1>
          <p className="text-sm text-zinc-500">Monitor your abandoned leads and manage active integrations.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Leads Captured</h3>
            <p className="text-3xl font-semibold tracking-tight text-zinc-900">{leads.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Active Project</h3>
            <p className="text-lg font-medium tracking-tight text-zinc-800 truncate mt-1">
              {activePage ? activePage.url : "No project connected"}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Google Sheets</h3>
            <div className="mt-1">
              {activePage?.google_sheet_id ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Not Connected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Setup & Integrations */}
        {!activePage ? (
          <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
              <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-2">Register your target page</h3>
            <p className="text-sm text-zinc-500 mb-6">Enter the exact URL of the page containing your form. We will only track data on this specific domain.</p>
            <div className="flex gap-2 justify-center w-full">
              <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="e.g., https://yoursite.com" className="w-2/3 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400" />
              <button onClick={handleAddUrl} className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">Connect</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tracking Script Box */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 mb-1">Installation Script</h2>
                <p className="text-xs text-zinc-500 mb-4">Paste this script inside the <code>&lt;head&gt;</code> or <code>&lt;body&gt;</code> of your website.</p>
              </div>
              <div className="relative group">
                <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-4 pr-16 overflow-x-auto shadow-inner">
                  <code className="text-[13px] text-zinc-300 font-mono whitespace-nowrap">
                    <span className="text-pink-400">&lt;script</span> <span className="text-blue-300">src=</span><span className="text-amber-300">"{typeof window !== 'undefined' ? window.location.origin : ''}/lr.js"</span><span className="text-blue-300">data-account=</span><span className="text-amber-300">"{user.id}"</span> <span className="text-pink-400">defer&gt;&lt;/script&gt;</span>
                  </code>
                </div>
                <button onClick={copyScript} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg border border-[#333] transition-colors text-white text-xs font-medium shadow-sm">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Google Sheets Box */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v13C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-13C22 4.12 20.88 3 19.5 3zM14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                    Google Sheets Sync
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  Share your sheet with <strong className="text-zinc-900 font-medium bg-zinc-100 px-1 rounded">leadrecover-bot@leadrecover-495516.iam.gserviceaccount.com</strong> as an Editor, then paste the URL below.
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <input 
                  type="text" 
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder={activePage.google_sheet_id ? "✓ Connected (Paste new link to change)" : "https://docs.google.com/spreadsheets/d/..."}
                  className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400"
                />
                <button onClick={handleConnectSheet} className="bg-white text-zinc-900 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                  {activePage.google_sheet_id ? "Update" : "Connect"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-zinc-900">Lead Database</h2>
            <span className="text-xs text-zinc-500 font-medium bg-zinc-100 px-2.5 py-1 rounded-full">Real-time</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">Date Captured</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">Phone Number</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">Source Page</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">Captured Fields</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                      Waiting for your first form abandonment...
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {new Date(lead.created_at).toLocaleDateString()} <span className="text-zinc-400 text-xs ml-1">{new Date(lead.created_at).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                        {lead.phone_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 truncate max-w-[150px]" title={lead.source_url}>
                        {lead.source_url ? new URL(lead.source_url).pathname : "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">
                        <div className="flex gap-1.5 flex-wrap">
                          {Object.entries(lead.form_data || {}).map(([key, value]: any) => (
                            <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                              <span className="text-zinc-400 mr-1">{key}:</span> <span className="truncate max-w-[100px]">{value}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}