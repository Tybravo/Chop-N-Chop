"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Array to generate the 3x4 desktop image grid quickly
  const gridImages = Array.from({ length: 12 }).map((_, i) => 
    `https://source.unsplash.com/random/300x300?food,meal,nigerian&sig=${i}`
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 selection:bg-[#FC6B31] selection:text-white">
      
      {/* 
        MAIN AUTH CONTAINER 
        Mobile: standard column. Desktop (lg): wide flex row 
      */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* =========================================
            LEFT PANEL (The Form)
            ========================================= */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Mobile Illustration (Hidden on Desktop) */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="relative w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center">
               <img 
                 src="/hero-food-illustration.png" 
                 alt="Chef Illustration" 
                 className="w-32 h-32 object-contain drop-shadow-lg"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/200x200/transparent/orange?text=Chef"; }}
               />
            </div>
          </div>

          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-8 lg:mb-10 justify-center lg:justify-start">
            <div className="w-8 h-8 bg-[#FC6B31] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">ChopNChop</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Create an Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#FC6B31] font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#FC6B31] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:bg-orange-600 active:scale-[0.99] transition-all mt-2"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-xs text-gray-400 font-medium">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </button>
          </div>

          {/* TOS */}
          <p className="text-center text-xs text-gray-400 mt-8">
            By clicking Sign Up, you agree to ChopNChop's <br className="hidden lg:block"/>
            <a href="#" className="text-gray-600 hover:underline">Terms of Service</a> & <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
          </p>

        </div>

        {/* =========================================
            RIGHT PANEL (Desktop Image Grid)
            ========================================= */}
        <div className="hidden lg:flex w-1/2 bg-gray-100 p-4">
          <div className="w-full h-full rounded-[24px] overflow-hidden grid grid-cols-3 grid-rows-4 gap-2">
            {gridImages.map((src, idx) => (
              <div key={idx} className="relative w-full h-full overflow-hidden group">
                <img 
                  src={src} 
                  alt="Delicious food preview" 
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