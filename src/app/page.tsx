"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [liveLeads, setLiveLeads] = useState([
    { t: "Just now", p: "987-654-3210", d: "{ name: 'John' }", s: "Abandoned", c: "amber" },
    { t: "2m ago", p: "555-019-8273", d: "{ co: 'Acme' }", s: "Recovered", c: "green" },
  ]);

  // Handle shrink-on-scroll header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Leads Animation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPhones = ["415-555-0198", "212-555-8832", "312-555-9011", "650-555-1234"];
      const randomData = ["{ name: 'Sarah' }", "{ email: 's@...' }", "{ co: 'Stripe' }", "{ role: 'CEO' }"];
      const newLead = {
        t: "Just now",
        p: randomPhones[Math.floor(Math.random() * randomPhones.length)],
        d: randomData[Math.floor(Math.random() * randomData.length)],
        s: Math.random() > 0.7 ? "Recovered" : "Abandoned",
        c: Math.random() > 0.7 ? "green" : "amber",
      };
      setLiveLeads(prev => {
        const updated = [newLead, ...prev.map(l => ({ ...l, t: l.t === "Just now" ? "1m ago" : l.t }))];
        return updated.slice(0, 3);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Step Cycle Animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(stepInterval);
  }, []);

  const faqs = [
    { q: "Is capturing form data before submission legal?", a: "Yes, when done correctly. You must disclose data collection in your privacy policy and provide an opt-out mechanism. LeadRecover is fully compliant with GDPR, CCPA, and CAN-SPAM when deployed with our recommended consent flow." },
    { q: "Will it slow down my website?", a: "No. The script is 2KB gzipped and loads asynchronously after your page's first paint. It doesn't block any resources and has zero measurable impact on Core Web Vitals." },
    { q: "What if a visitor submits the form successfully?", a: "LeadRecover detects successful form submissions and marks the session as 'Converted' in your Sheet. You can filter by status to only call truly abandoned leads." },
    { q: "How do I connect my Google Sheet?", a: "In your LeadRecover dashboard, paste your Google Sheet URL and follow the 2-step setup. You share the sheet with our bot email address, and we handle the rest." },
    { q: "Can I use LeadRecover with any website builder?", a: "Yes. LeadRecover works with any HTML-based website — Webflow, WordPress, Squarespace, Framer, custom Next.js apps, and more. Just paste the script tag before your closing </body> tag." },
  ];

  const steps = [
    { num: "01", title: "Paste one script tag", desc: "Copy a single line of JavaScript into your site's <head>. Works with any stack — Next.js, Webflow, WordPress.", icon: "code" },
    { num: "02", title: "Connect your Sheet", desc: "Share a Google Sheet with our service account. Data flows directly to your rows in under 400ms. No Zapier needed.", icon: "sheet" },
    { num: "03", title: "Call your leads back", desc: "Every partial form entry lands in your Sheet with phone, email, and session context. Your team closes the gap.", icon: "call" },
  ];

  const testimonials = [
    { name: "Alex Kim", role: "Founder, FormFlow", text: "We recovered $14K in our first month. I didn't change anything on our site except adding the script.", avatar: "AK", color: "#C84B11" },
    { name: "Maria Reyes", role: "Head of Growth, Cartly", text: "Our sales team was skeptical until they saw the Sheet filling up in real-time during a campaign. Now it's non-negotiable.", avatar: "MR", color: "#1A6B3C" },
    { name: "James Tran", role: "CTO, Optica AI", text: "Two lines of code, zero performance impact. The session upserting is genius — completely clean data from day one.", avatar: "JT", color: "#0D0D0D" },
  ];

  const stats = [
    { value: "$2.4M", label: "Recovered" },
    { value: "400ms", label: "Latency" },
    { value: "2,400+", label: "Teams" },
    { value: "2KB", label: "Script Size" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#0D0D0D] font-sans selection:bg-[#FBF1EC] selection:text-[#C84B11] overflow-x-hidden w-full relative">

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .row-enter { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .shimmer { animation: shimmer 2s ease-in-out infinite; }
        .step-bar { transition: width 2.8s linear; }
        @keyframes flowLine { 0% { left: -10%; } 100% { left: 110%; } }
        .flow-line { animation: flowLine 3s linear infinite; }
        /* Hide scrollbar for code snippet */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── NAV (ALWAYS FLOATING PILL) ── */}
      <div className="fixed top-4 md:top-6 z-50 w-full flex justify-center px-4 md:px-0 pointer-events-none">
        <nav className={`pointer-events-auto transition-all duration-500 overflow-visible rounded-2xl w-full md:w-[900px] ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2 md:py-3 px-5 md:px-6" 
            : "bg-white/60 backdrop-blur-md border border-[#E5E3DE] shadow-sm py-3 md:py-4 px-5 md:px-6"
        }`}>
          <div className="mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={`bg-[#0D0D0D] rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm ${isScrolled ? 'w-[28px] h-[28px]' : 'w-[32px] h-[32px]'}`}>
                <span className="text-white text-[10px] font-bold tracking-[0.08em]">LR</span>
              </div>
              <span className="font-semibold text-[15px] md:text-[16px] tracking-[-0.02em]">LeadRecover</span>
            </Link>
            
            {/* Desktop Nav Links */}
            <div className={`hidden md:flex items-center gap-1 transition-all`}>
              {['How it works', 'Features', 'Pricing', 'FAQ'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className={`text-[13px] font-medium transition-all rounded-md text-[#666] hover:text-[#0D0D0D] hover:bg-black/5 px-4 py-1.5`}>
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-[13px] md:text-[14px] font-medium text-[#666] hover:text-[#0D0D0D] transition-colors">Sign in</Link>
              <Link href="/login" className={`bg-[#0D0D0D] text-white text-[13px] md:text-[14px] font-semibold rounded-lg hover:bg-[#2a2a2a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 px-4 py-2`}>
                Get started →
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex flex-col gap-[5px] p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-[2px] bg-[#0D0D0D] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Nav Dropdown (Absolute to not expand the pill itself) */}
          <div className={`md:hidden absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-[#E5E3DE] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[400px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 border-transparent'}`}>
            {['How it works', 'Features', 'Pricing', 'FAQ'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="block text-[15px] font-medium text-[#0D0D0D] py-3 border-b border-[#E5E3DE]/40">
                {item}
              </Link>
            ))}
            <div className="flex gap-3 mt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center border border-[#E5E3DE] text-[#0D0D0D] text-[14px] font-semibold px-4 py-2.5 rounded-lg">Sign in</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-[#0D0D0D] text-white text-center text-[14px] font-semibold px-4 py-2.5 rounded-lg">Get started</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="pt-[140px] md:pt-[180px] pb-16 md:pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-[60px] items-center relative">
          <div className="absolute top-20 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C84B11]/5 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"></div>

          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-[#E5E3DE] bg-white/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] md:text-[12px] font-medium text-[#0D0D0D] mb-6 md:mb-8 shadow-sm fade-up">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A6B3C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A6B3C]"></span>
              </div>
              Live tracking · 400ms sync
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-[72px] leading-[1.05] tracking-[-0.03em] text-[#0D0D0D] mb-6 text-balance fade-up fade-up-1">
              Recover leads that <br className="hidden lg:block"/><em className="text-[#C84B11] italic pr-2">almost</em> converted.
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.65] text-[#666] font-light max-w-[480px] mx-auto lg:mx-0 mb-8 md:mb-10 text-balance fade-up fade-up-2">
              A 2KB invisible script captures phone numbers and emails the moment they're typed — before your visitor clicks away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 fade-up fade-up-3">
              <Link href="/login" className="w-full sm:w-auto text-center bg-[#0D0D0D] text-white text-[15px] font-semibold px-8 py-4 rounded-xl hover:bg-[#2a2a2a] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Start capturing for free
              </Link>
              <div className="flex items-center gap-3 px-4 py-2 mt-2 sm:mt-0">
                <div className="flex -space-x-2">
                  {['AK', 'MR', 'JT'].map((initial, i) => (
                    <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-[#FDFDFC] bg-[#F5F4F2] text-[9px] md:text-[10px] font-bold flex items-center justify-center text-[#0D0D0D] z-10 shadow-sm">{initial}</div>
                  ))}
                </div>
                <div className="text-[12px] md:text-[13px] text-[#666] font-medium leading-tight">
                  <span className="text-[#0D0D0D] font-bold">2,400+</span> teams<br/>recovering revenue.
                </div>
              </div>
            </div>
          </div>

          {/* Live Dashboard Mockup */}
          <div className="relative w-full perspective-1000 hidden lg:block">
            <div className="bg-white border border-[#E5E3DE] rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transform rotate-y-[-5deg] rotate-x-[2deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              <div className="h-[48px] bg-[#FAFAF9] border-b border-[#E5E3DE] flex items-center justify-between px-5">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E5E3DE]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#E5E3DE]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#E5E3DE]"></span>
                </div>
                <span className="text-[12px] font-mono text-[#999] bg-[#F5F4F2] px-3 py-1 rounded-md border border-[#E5E3DE]/50">dashboard / live-feed</span>
                <span className="text-[11px] text-[#1A6B3C] font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#1A6B3C] rounded-full animate-pulse"></span> REC
                </span>
              </div>
              <div className="p-6 bg-[#FDFDFC]">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[{ l: "Total Captured", v: "1,482" }, { l: "Recovered Rev", v: "$8.4K" }, { l: "Active Users", v: "42" }].map((stat, i) => (
                    <div key={i} className="bg-white border border-[#E5E3DE] rounded-[12px] p-4 shadow-sm">
                      <div className="text-[10px] md:text-[11px] text-[#999] font-bold uppercase tracking-[0.06em] mb-1">{stat.l}</div>
                      <div className="text-[20px] md:text-[24px] font-serif tracking-tight text-[#0D0D0D]">{stat.v}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[80px_1fr_1fr_95px] gap-3 px-3 pb-3 text-[11px] font-bold text-[#999] uppercase tracking-[0.08em] border-b border-[#E5E3DE]">
                  <span>Time</span><span>Contact</span><span>Payload</span><span>Status</span>
                </div>
                <div className="relative min-h-[160px] overflow-hidden">
                  {liveLeads.map((row, i) => (
                    <div key={`${row.p}-${i}`} className="grid grid-cols-[80px_1fr_1fr_95px] gap-3 px-3 py-3.5 text-[13px] items-center border-b border-[#F2F1EE] last:border-0 row-enter bg-white">
                      <span className="font-mono text-[12px] text-[#666]">{row.t}</span>
                      <span className="font-medium text-[#0D0D0D] truncate">{row.p}</span>
                      <span className="font-mono text-[11px] font-medium bg-[#F5F4F2] border border-[#E5E3DE]/50 text-[#666] px-2 py-1 rounded-md w-fit truncate max-w-[80px]">{row.d}</span>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${row.c === 'amber' ? 'bg-[#FEF6E7] text-[#92600A]' : 'bg-[#EBF5EF] text-[#1A6B3C]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${row.c === 'amber' ? 'bg-[#92600A]' : 'bg-[#1A6B3C]'}`}></span>{row.s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <section className="border-y border-[#E5E3DE] bg-[#FAFAF9] py-8 md:py-12 overflow-hidden flex flex-col md:flex-row items-center">
        <div className="w-full md:w-[150px] shrink-0 px-8 md:border-r border-[#E5E3DE] z-10 bg-[#FAFAF9] mb-4 md:mb-0 text-center md:text-left">
          <div className="text-[12px] font-bold text-[#999] uppercase tracking-[0.1em] leading-tight">Trusted by<br className="hidden md:block"/>top teams</div>
        </div>
        <div className="flex-1 w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FAFAF9] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10"></div>
          <div className="flex w-[200%] animate-marquee">
            <div className="flex w-1/2 justify-around items-center px-4 md:px-10">
              {['Salesforce', 'HubSpot', 'Shopify', 'Intercom', 'Segment', 'Typeform'].map(logo => (
                <span key={logo} className="text-[16px] md:text-[18px] font-serif italic text-[#0D0D0D]/30 tracking-tight">{logo}</span>
              ))}
            </div>
            <div className="flex w-1/2 justify-around items-center px-4 md:px-10">
              {['Salesforce', 'HubSpot', 'Shopify', 'Intercom', 'Segment', 'Typeform'].map(logo => (
                <span key={`dup-${logo}`} className="text-[16px] md:text-[18px] font-serif italic text-[#0D0D0D]/30 tracking-tight">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR (ONE ROW MOBILE COMPACT) ── */}
      <section className="py-12 md:py-[80px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-4 gap-px bg-[#E5E3DE] border border-[#E5E3DE] rounded-[16px] md:rounded-[24px] overflow-hidden">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#FDFDFC] px-2 py-5 md:px-8 md:py-10 flex flex-col justify-center gap-1 md:gap-2 hover:bg-[#FAFAF9] transition-colors text-center md:text-left">
                <span className="font-serif text-[18px] sm:text-[24px] md:text-[48px] leading-none tracking-tight text-[#0D0D0D]">{stat.value}</span>
                <span className="text-[9px] sm:text-[11px] md:text-[13px] font-medium text-[#999] leading-tight md:leading-snug mx-auto md:mx-0 max-w-[80px] md:max-w-none">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (PIPELINE) ── */}
      <section id="how-it-works" className="py-16 md:py-[120px] border-t border-[#E5E3DE] bg-[#FAFAF9]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="mb-12 md:mb-20 text-center md:text-left">
            <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#C84B11] mb-4">Process</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
              <h2 className="font-serif text-3xl md:text-[56px] leading-[1.1] tracking-[-0.03em] text-[#0D0D0D]">
                Up and running<br className="hidden md:block"/><em className="italic">in 90 seconds.</em>
              </h2>
              <p className="text-[15px] md:text-[16px] text-[#666] max-w-[340px] mx-auto md:mx-0 font-light leading-relaxed">
                No SDK to learn. No webhook configuration. No Zapier account. Just a script tag and a Google Sheet.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* The Pipeline Line (Hidden on Mobile, visible on MD) */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-[#E5E3DE] z-0 rounded-full overflow-hidden">
               <div className="absolute top-0 left-0 w-[20%] h-full bg-gradient-to-r from-transparent via-[#C84B11] to-transparent flow-line"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
              {steps.map((step, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  className={`relative bg-white border rounded-[20px] md:rounded-[24px] p-8 md:p-10 cursor-pointer transition-all duration-300 ${activeStep === i ? 'border-[#0D0D0D] shadow-xl md:-translate-y-2' : 'border-[#E5E3DE] hover:border-[#bbb]'}`}
                >
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Circle Node */}
                    <div className={`w-12 h-12 rounded-full border-4 mb-6 flex items-center justify-center font-mono text-[13px] font-bold transition-colors duration-300 ${activeStep === i ? 'bg-[#0D0D0D] border-[#0D0D0D] text-white' : 'bg-white border-[#E5E3DE] text-[#999]'}`}>
                      {step.num}
                    </div>
                    {activeStep === i && <div className="md:hidden absolute top-8 right-8 text-[10px] font-bold text-[#1A6B3C] bg-[#EBF5EF] px-2.5 py-1 rounded-full uppercase tracking-wider">Active</div>}
                    
                    <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0D0D0D] mb-3">{step.title}</h3>
                    <p className="text-[14px] md:text-[15px] text-[#666] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section id="features" className="py-16 md:py-[120px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#C84B11] mb-4">Capabilities</div>
            <h2 className="font-serif text-3xl md:text-[56px] leading-[1.1] tracking-[-0.03em] text-[#0D0D0D] mb-4 md:mb-5">
              Engineered for <em className="italic">conversion.</em>
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#666] max-w-[600px] mx-auto font-light">
              Every feature is built to capture the lead before the session ends, securely and instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto md:auto-rows-[280px]">
            {/* Big Feature (Fixed Script Container) */}
            <div className="md:col-span-2 bg-[#FAFAF9] border border-[#E5E3DE] rounded-[20px] md:rounded-[24px] p-8 md:p-10 relative overflow-hidden group hover:border-[#bbb] transition-colors min-h-[300px] md:min-h-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C84B11]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-[#E5E3DE] rounded-xl flex items-center justify-center shadow-sm mb-5 md:mb-6">
                    <svg className="w-5 h-5 md:w-6 md:h-6 stroke-[#0D0D0D]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  </div>
                  <h3 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-[#0D0D0D] mb-2 md:mb-3">2KB Drop-in Script</h3>
                  <p className="text-[14px] md:text-[16px] text-[#666] leading-relaxed max-w-md mb-6 md:mb-0">
                    Loaded asynchronously. Zero impact on Core Web Vitals. Install once and forget it.
                  </p>
                </div>
                {/* Properly formatted and fixed IDE snippet */}
                <div className="bg-[#0D0D0D] border border-[#222] rounded-xl w-full shadow-lg mt-4 md:mt-0 shrink-0 overflow-hidden">
                  <div className="flex px-4 py-2 border-b border-[#222] bg-[#111]">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                    </div>
                  </div>
                  <div className="p-4 overflow-x-auto scrollbar-hide">
                    <pre className="m-0"><code className="font-mono text-[12px] md:text-[13px] text-white whitespace-pre">
                      <span className="text-[#888]">{'<'}</span><span className="text-[#FF7B72]">script</span> <span className="text-[#B392F0]">src</span><span className="text-[#888]">{'='}</span><span className="text-[#A5D6FF]">"https://leadrecover.vercel.app/lr.js"</span> <span className="text-[#B392F0]">defer</span><span className="text-[#888]">{'>'}{'</'}</span><span className="text-[#FF7B72]">script</span><span className="text-[#888]">{'>'}</span>
                    </code></pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Feature */}
            <div className="bg-[#0D0D0D] rounded-[20px] md:rounded-[24px] p-8 md:p-10 relative overflow-hidden group min-h-[240px] md:min-h-auto shadow-xl">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                    <svg className="w-5 h-5 md:w-6 md:h-6 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <h3 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-white mb-2 md:mb-3">Google Sheets Native</h3>
                  <p className="text-[14px] md:text-[16px] text-white/60 leading-relaxed mb-6 md:mb-0">
                    Service Account Auth pushes rows in &lt;400ms. No Zapier required.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1A6B3C] shimmer shrink-0"></span>
                  <span className="font-mono text-[11px] md:text-[12px] text-[#888]">Live push · row upsert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 md:py-[120px] border-t border-[#E5E3DE] bg-[#FAFAF9]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-3xl md:text-[56px] leading-[1.1] tracking-[-0.03em] text-[#0D0D0D] mb-6">
              Simple pricing. <br className="md:hidden"/><em className="italic text-[#C84B11]">No scale taxes.</em>
            </h2>
            <div className="inline-flex items-center p-1 bg-[#FDFDFC] border border-[#E5E3DE] rounded-xl mx-auto shadow-sm">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-5 py-2 md:px-6 md:py-2.5 text-[13px] md:text-[14px] font-bold rounded-lg transition-all ${!annualBilling ? 'bg-[#0D0D0D] text-white shadow-md' : 'text-[#666] hover:text-[#0D0D0D]'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-5 py-2 md:px-6 md:py-2.5 text-[13px] md:text-[14px] font-bold rounded-lg transition-all flex items-center gap-2 ${annualBilling ? 'bg-[#0D0D0D] text-white shadow-md' : 'text-[#666] hover:text-[#0D0D0D]'}`}
              >
                Yearly <span className={`${annualBilling ? 'bg-white/20 text-white' : 'bg-[#EBF5EF] text-[#1A6B3C]'} text-[9px] md:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block`}>Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Free */}
            <div className="bg-white border border-[#E5E3DE] rounded-[20px] md:rounded-[24px] p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-[13px] md:text-[14px] font-bold text-[#666] uppercase tracking-[0.1em] mb-4">Free</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-serif text-[40px] md:text-[48px] tracking-tight text-[#0D0D0D]">$0</span>
                <span className="text-[14px] md:text-[15px] text-[#666] font-medium">/mo</span>
              </div>
              <p className="text-[13px] md:text-[14px] text-[#999] leading-relaxed mb-6 h-10">Get started and see LeadRecover in action.</p>
              <Link href="/login" className="block text-center bg-[#F5F4F2] text-[#0D0D0D] font-bold text-[14px] md:text-[15px] py-3 rounded-xl hover:bg-[#E5E3DE] transition-colors mb-6">Start for free</Link>
              <ul className="space-y-3">
                {['1 active domain', '50 leads/mo', 'Google Sheets sync'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] text-[#666] font-medium">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#EBF5EF] flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[#1A6B3C]" fill="none" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Production */}
            <div className="bg-[#0D0D0D] border border-[#0D0D0D] rounded-[20px] md:rounded-[24px] p-6 md:p-8 relative shadow-2xl md:transform md:-translate-y-4">
              <div className="absolute top-0 right-6 md:right-8 transform -translate-y-1/2 bg-[#C84B11] text-white text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">Most popular</div>
              <div className="text-[13px] md:text-[14px] font-bold text-white/50 uppercase tracking-[0.1em] mb-4">Production</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-serif text-[40px] md:text-[48px] tracking-tight text-white">${annualBilling ? '119' : '149'}</span>
                <span className="text-[14px] md:text-[15px] text-white/50 font-medium">/mo</span>
              </div>
              <p className="text-[13px] md:text-[14px] text-white/50 leading-relaxed mb-6 h-10">Uncapped scale for teams generating serious volume.</p>
              <Link href="/login" className="block text-center bg-white text-[#0D0D0D] font-bold text-[14px] md:text-[15px] py-3 rounded-xl hover:bg-[#F0F0EE] transition-all mb-6 shadow-lg">Get started</Link>
              <ul className="space-y-3">
                {['Unlimited domains', 'Unlimited leads', 'Real-time Webhooks', 'Priority Slack support'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] text-white/90 font-medium">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#1A6B3C]/20 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[#27C93F]" fill="none" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-[#E5E3DE] rounded-[20px] md:rounded-[24px] p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-[13px] md:text-[14px] font-bold text-[#666] uppercase tracking-[0.1em] mb-4">Enterprise</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-serif text-[40px] md:text-[48px] tracking-tight text-[#0D0D0D]">Custom</span>
              </div>
              <p className="text-[13px] md:text-[14px] text-[#999] leading-relaxed mb-6 h-10">For large orgs needing SLAs and dedicated support.</p>
              <Link href="mailto:sales@leadrecover.io" className="block text-center bg-transparent border border-[#0D0D0D] text-[#0D0D0D] font-bold text-[14px] md:text-[15px] py-3 rounded-xl hover:bg-[#0D0D0D] hover:text-white transition-colors mb-6">Talk to sales</Link>
              <ul className="space-y-3">
                {['Custom retention', 'SSO via SAML', 'Dedicated CSM', 'Uptime SLA'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] text-[#666] font-medium">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#EBF5EF] flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[#1A6B3C]" fill="none" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 md:py-[120px] border-t border-[#E5E3DE] bg-[#FDFDFC]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="max-w-[700px] mx-auto">
            <h2 className="font-serif text-3xl md:text-[48px] leading-[1.1] tracking-[-0.03em] text-[#0D0D0D] mb-8 md:mb-12 text-center md:text-left">
              Frequently asked questions.
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-[#E5E3DE] rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#bbb]">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left p-5 md:p-6 group">
                    <h4 className="text-[15px] md:text-[16px] font-semibold text-[#0D0D0D] pr-4 md:pr-8">{faq.q}</h4>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'bg-[#0D0D0D] rotate-180' : 'bg-[#F5F4F2] group-hover:bg-[#E5E3DE]'}`}>
                      <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${openFaq === i ? 'stroke-white' : 'stroke-[#0D0D0D]'}`} fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === i ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[14px] md:text-[15px] text-[#666] leading-[1.7] px-5 md:px-6 pb-5 md:pb-6 pt-1 md:pt-2">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="bg-[#0D0D0D] pt-[80px] md:pt-[120px] pb-8 md:pb-10 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-[#C84B11]/20 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-5 md:px-8 relative z-10">
          <div className="max-w-[760px] mx-auto mb-[60px] md:mb-[100px]">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[72px] leading-[1.05] tracking-[-0.035em] text-white mb-5 md:mb-6 text-balance">
              Your next 50 leads are <br className="hidden md:block"/><em className="italic text-[#C84B11]">already typing.</em>
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/50 font-light mb-8 md:mb-10 text-balance px-4 md:px-0">
              Deploy in 90 seconds. See your first recovered lead before your coffee gets cold.
            </p>
            <Link href="/login" className="inline-block bg-white text-[#0D0D0D] font-bold px-8 py-4 md:px-10 md:py-5 rounded-xl text-[15px] md:text-[16px] hover:bg-[#e8e8e6] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Get started for free
            </Link>
            <p className="text-[11px] md:text-[13px] text-white/30 mt-5 md:mt-6 font-medium tracking-wide uppercase">No credit card required · Cancel anytime</p>
          </div>

          <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] bg-white rounded flex items-center justify-center">
                <span className="text-[#0D0D0D] text-[7px] md:text-[8px] font-bold tracking-[0.08em]">LR</span>
              </div>
              <span className="font-semibold text-[13px] md:text-[14px] tracking-[-0.02em] text-white">LeadRecover</span>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              {['Privacy', 'Terms', 'Docs'].map(link => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-[12px] md:text-[13px] text-white/40 hover:text-white/70 transition-colors">{link}</Link>
              ))}
            </div>
            <p className="text-[12px] md:text-[13px] text-white/40">© {new Date().getFullYear()} LeadRecover Inc.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}