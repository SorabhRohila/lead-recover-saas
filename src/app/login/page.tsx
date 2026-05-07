"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Connect to your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUpMode) {
      await handleSignUp();
    } else {
      await handleLogin();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("Creating account...");
    
    // 1. Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setMessage(error.message); // Show exact Supabase error (e.g. password too short)
    } else if (data.user) {
      
      // 2. Safely attempt to create SaaS Profile
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, email: email, plan_limit: 5 }
      ]);
      
      if (profileError) {
        console.error("Profile Error: You may need to create the 'profiles' table in Supabase.", profileError);
      }

      // 3. Check if email confirmation is required by Supabase
      if (data.session) {
        setMessage("Success! Taking you to your dashboard...");
        router.push("/dashboard"); // FIXED: Routes to Dashboard now!
      } else {
        setMessage("Success! Please check your email to verify your account.");
      }
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("Logging in...");
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage(error.message); // Show error (e.g. "Invalid login credentials")
    } else if (data.session) {
      setMessage("Success! Redirecting...");
      router.push("/dashboard"); // FIXED: Routes to Dashboard now!
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#FDFDFC] text-[#0D0D0D] font-sans selection:bg-[#FBF1EC] selection:text-[#C84B11] w-full">
      
      {/* ── LEFT COLUMN (BRANDING & SOCIAL PROOF - DARK THEME LIKE FOOTER) ── */}
      <div className="hidden lg:flex w-[45%] bg-[#0D0D0D] flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Background Glowing Blob (Matching Landing Page) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C84B11]/15 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 z-10 w-fit group">
          <div className="w-[32px] h-[32px] bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
            <span className="text-[#0D0D0D] text-[10px] font-bold tracking-[0.08em]">LR</span>
          </div>
          <span className="font-semibold text-[16px] tracking-[-0.02em] text-white">LeadRecover</span>
        </Link>

        {/* Testimonial Content */}
        <div className="z-10 flex flex-col items-center justify-center text-center max-w-[440px] mx-auto w-full mb-10">
          <h2 className="font-serif text-[36px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-white mb-10 text-balance">
            "We recovered $14K in our first month. I didn't change anything on our site except adding the script."
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-[64px] h-[64px] rounded-full overflow-hidden border-2 border-white/10 bg-[#FAFAF9] flex items-center justify-center text-[20px] font-bold text-[#0D0D0D]">
                AK
              </div>
            </div>
            <div className="text-[16px] font-medium text-white mb-1">Alex Kim</div>
            <div className="text-[14px] text-white/50 mb-5">Founder, FormFlow</div>
            
            {/* 5 Stars in Brand Orange */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-[18px] h-[18px] text-[#C84B11]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-[13px] text-white/40">
          © {new Date().getFullYear()} LeadRecover Inc. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT COLUMN (FORM - LIGHT THEME LIKE LANDING PAGE) ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 md:px-20 relative bg-[#FDFDFC]">
        
        {/* Subtle background blur for the light side */}
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#C84B11]/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {/* Mobile Logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2.5 absolute top-8 left-6 sm:left-12 group">
          <div className="w-[32px] h-[32px] bg-[#0D0D0D] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-[10px] font-bold tracking-[0.08em]">LR</span>
          </div>
          <span className="font-semibold text-[16px] tracking-[-0.02em]">LeadRecover</span>
        </Link>

        <div className="max-w-[400px] w-full mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="font-serif text-[32px] md:text-[36px] leading-[1.1] tracking-[-0.03em] text-[#0D0D0D] mb-3">
              {isSignUpMode ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-[15px] text-[#666]">
              {isSignUpMode ? "Sign up to start recovering your leads." : "Please enter your details to sign in."}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-3 text-[13px] rounded-xl text-center font-medium border ${message.includes("Success") ? 'bg-[#EBF5EF] text-[#1A6B3C] border-[#1A6B3C]/20' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-[#0D0D0D] mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-[#FAFAF9] border border-[#E5E3DE] rounded-xl px-4 py-3 text-[15px] text-[#0D0D0D] placeholder-[#999] focus:outline-none focus:border-[#0D0D0D] focus:ring-1 focus:ring-[#0D0D0D] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#0D0D0D] mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#FAFAF9] border border-[#E5E3DE] rounded-xl px-4 py-3 text-[15px] text-[#0D0D0D] placeholder-[#999] focus:outline-none focus:border-[#0D0D0D] focus:ring-1 focus:ring-[#0D0D0D] transition-all pr-10"
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0D0D0D] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>

            {!isSignUpMode && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#E5E3DE] bg-white text-[#0D0D0D] focus:ring-[#0D0D0D] focus:ring-offset-0 cursor-pointer accent-[#0D0D0D]" />
                  <span className="text-[13px] font-medium text-[#666] group-hover:text-[#0D0D0D] transition-colors">Remember for 30 days</span>
                </label>
                <Link href="#" className="text-[13px] font-semibold text-[#0D0D0D] hover:text-[#C84B11] transition-colors">Forgot password</Link>
              </div>
            )}

            <div className="pt-3 flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0D0D0D] text-white font-bold text-[15px] py-3 rounded-xl hover:bg-[#2a2a2a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  isSignUpMode ? "Sign up" : "Sign in"
                )}
              </button>

              <button 
                type="button"
                className="w-full bg-white border border-[#E5E3DE] text-[#0D0D0D] font-bold text-[15px] py-3 rounded-xl hover:bg-[#FAFAF9] hover:border-[#bbb] transition-all flex justify-center items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign {isSignUpMode ? "up" : "in"} with Google
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#666]">
              {isSignUpMode ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setMessage("");
                }} 
                className="font-bold text-[#0D0D0D] hover:text-[#C84B11] hover:underline transition-all"
              >
                {isSignUpMode ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}