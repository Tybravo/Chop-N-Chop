"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  // Desktop Image Grid
  const gridImages = Array.from({ length: 12 }).map((_, i) => 
    `https://source.unsplash.com/random/300x300?food,meal,spices&sig=${i + 30}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8 selection:bg-[#FC6B31] selection:text-white">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-zinc-800">
        
        {/* LEFT PANEL: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Back to Login */}
          <Link href="/customer/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FC6B31] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Log in
          </Link>

          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <div className="w-8 h-8 bg-[#FC6B31] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ChopNChop</span>
          </div>

          {!isSubmitted ? (
            <>
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  No worries! Enter your email address below and we&apos;ll send you instructions to reset your password.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email" 
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#FC6B31] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:bg-orange-600 active:scale-[0.99] transition-all mt-2"
                >
                  Send Reset Instructions
                </button>
              </form>
            </>
          ) : (
            <div className="text-center lg:text-left space-y-4 py-4">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-[#FC6B31] rounded-full flex items-center justify-center mx-auto lg:mx-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We have sent a secure password reset link to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>. Please check your inbox or spam folder.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-[#FC6B31] hover:underline pt-2 block"
              >
                Didn&apos;t receive the email? Try again
              </button>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Desktop Image Grid */}
        <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-zinc-950 p-4">
          <div className="w-full h-full rounded-[24px] overflow-hidden grid grid-cols-3 grid-rows-4 gap-2">
            {gridImages.map((src, idx) => (
              <div key={idx} className="relative w-full h-full overflow-hidden group bg-gray-200 dark:bg-zinc-800">
                <img 
                  src={src} 
                  alt="Food preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}