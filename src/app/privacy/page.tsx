"use client";

import Link from "next/link";
import { useState } from "react";

export default function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#0D0D0D] font-sans selection:bg-[#FBF1EC] selection:text-[#C84B11] overflow-x-hidden w-full relative flex flex-col">
      
      {/* ── NAV (ALWAYS FLOATING PILL) ── */}
      <div className="fixed top-4 md:top-6 z-50 w-full flex justify-center px-4 md:px-0 pointer-events-none">
        <nav className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2 md:py-3 px-5 md:px-6 rounded-2xl w-full md:w-[900px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-[#0D0D0D] rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm w-[28px] h-[28px]">
              <span className="text-white text-[10px] font-bold tracking-[0.08em]">LR</span>
            </div>
            <span className="font-semibold text-[15px] md:text-[16px] tracking-[-0.02em]">LeadRecover</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] md:text-[14px] font-medium text-[#666] hover:text-[#0D0D0D] transition-colors">Sign in</Link>
            <Link href="/login" className="bg-[#0D0D0D] text-white text-[13px] md:text-[14px] font-semibold rounded-lg hover:bg-[#2a2a2a] px-4 py-2 transition-all">Get started →</Link>
          </div>

          <button className="md:hidden flex flex-col gap-[5px] p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>

          {/* Mobile Menu */}
          <div className={`md:hidden absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-[#E5E3DE] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[400px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 border-transparent'}`}>
            <Link href="/" className="block text-[15px] font-medium text-[#0D0D0D] py-3 border-b border-[#E5E3DE]/40">Home</Link>
            <div className="flex gap-3 mt-4">
              <Link href="/login" className="flex-1 text-center border border-[#E5E3DE] text-[#0D0D0D] text-[14px] font-semibold px-4 py-2.5 rounded-lg">Sign in</Link>
              <Link href="/login" className="flex-1 bg-[#0D0D0D] text-white text-center text-[14px] font-semibold px-4 py-2.5 rounded-lg">Get started</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex-grow pt-[140px] md:pt-[180px] pb-16 md:pb-[80px] relative z-10">
        <div className="absolute top-20 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C84B11]/5 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-[800px] mx-auto px-5 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 border border-[#E5E3DE] bg-white/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] md:text-[12px] font-medium text-[#0D0D0D] mb-6 md:mb-8 hover:bg-[#F5F4F2] transition-colors">
            &larr; Back to Home
          </Link>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[64px] leading-[1.05] tracking-[-0.03em] text-[#0D0D0D] mb-4 text-balance">
            Privacy <em className="italic text-[#C84B11] pr-2">Policy.</em>
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#666] font-light mb-12">Last updated: May 7, 2026</p>
          
          <div className="space-y-10">
            <div>
              <h2 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-[#0D0D0D] mb-3">1. Data We Collect</h2>
              <p className="text-[15px] md:text-[16px] text-[#666] leading-relaxed">
                LeadRecover provides tools to track unsubmitted form data. The data collected 
                (emails, phone numbers) belongs solely to our users. We do not sell, rent, or 
                share this data with any third-party marketing agencies.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-[#0D0D0D] mb-3">2. How We Use Data</h2>
              <p className="text-[15px] md:text-[16px] text-[#666] leading-relaxed">
                Data is stored securely on our database and used exclusively to populate your 
                dashboard and connected Google Sheets. As a user, you retain full ownership of 
                the data captured through your custom scripts.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-[#0D0D0D] mb-3">3. Contact Us</h2>
              <p className="text-[15px] md:text-[16px] text-[#666] leading-relaxed">
                If you have any questions or concerns regarding this privacy policy, please 
                contact us at <a href="mailto:support@leadrecover.io" className="text-[#C84B11] hover:underline">support@leadrecover.io</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D0D0D] pt-[60px] md:pt-[80px] pb-8 md:pb-10 text-center relative overflow-hidden mt-auto">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-[#C84B11]/20 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 relative z-10 border-t border-white/10 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] bg-white rounded flex items-center justify-center">
              <span className="text-[#0D0D0D] text-[7px] md:text-[8px] font-bold tracking-[0.08em]">LR</span>
            </div>
            <span className="font-semibold text-[13px] md:text-[14px] tracking-[-0.02em] text-white">LeadRecover</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/privacy" className="text-[12px] md:text-[13px] text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] md:text-[13px] text-white/40 hover:text-white/70 transition-colors">Terms</Link>
          </div>
          <p className="text-[12px] md:text-[13px] text-white/40">© {new Date().getFullYear()} LeadRecover Inc.</p>
        </div>
      </footer>
    </div>
  );
}