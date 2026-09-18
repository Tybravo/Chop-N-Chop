"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("chopnchop_session", "active");
    router.push("/customer/home");
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FFFBF7] flex items-center justify-center p-4 lg:p-8 overflow-hidden selection:bg-[#FC6B31] selection:text-white">
      {/* Added mt-6 to give the main card container that clean breathing room at the top */}
      <div className="w-full max-w-5xl h-full lg:h-auto lg:max-h-[680px] mt-6 sm:mt-0 bg-white rounded-none lg:rounded-[40px] shadow-none lg:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row border-0 lg:border border-orange-100/60 overflow-hidden relative">
        
        {/* LEFT PANEL: Login Form Container */}
        <div className="w-full lg:w-1/2 px-6 py-5 lg:p-12 flex flex-col h-full">
          <div className="w-full flex-1 flex flex-col justify-center">
            {/* Logo & Brand Header */}
            <div className="flex flex-col items-center lg:items-start mb-4 lg:mb-6">
              <div className="flex items-center gap-2 mb-1">
                <img src="/logo_icon.png" alt="ChopnChop" className="w-7 h-7 lg:w-9 lg:h-9 object-contain" />
                <img src="/Chopnchop.png" alt="ChopnChop" className="h-6 lg:h-8 object-contain" />
              </div>
              <span className="text-[9px] lg:text-[11px] text-gray-400 font-bold uppercase tracking-widest">Good Food. Great Vibes.</span>
            </div>

            {/* Header Title */}
            <div className="mb-4 lg:mb-6 text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-500 mt-1">Login to your ChopnChop account and continue your food journey.</p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email or Phone Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Email or Phone Number"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 lg:py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-2.5 lg:py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#FC6B31] rounded"
                  />
                  <span className="text-gray-600 font-medium">Remember me</span>
                </label>
                <Link href="/customer/forgot-password" className="font-bold text-[#FC6B31] hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-sm tracking-wide"
                >
                  Log In
                </button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <Link href="/customer/signup" className="font-extrabold text-[#FC6B31] hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Base Illustration - sits at bottom */}
          <div className="w-full mt-auto flex justify-center lg:hidden overflow-hidden pb-2">
            <img 
              src="/CNC-tall%20building%20structure.png" 
              alt="ChopnChop Building Structure" 
              className="w-full max-w-[320px] h-52 object-contain object-bottom"
            />
          </div>
        </div>

        {/* RIGHT PANEL: Desktop Ambient Illustration Pane */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#FDF7F2] p-8 items-center justify-center relative overflow-hidden border-l border-orange-100/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/30 pointer-events-none" />
          <img 
            src="/CNC-man%20riding%20bike.png" 
            alt="ChopnChop Rider Delivery" 
            className="w-full h-full max-h-[480px] object-contain relative z-10 drop-shadow-md transform hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </div>
  );
}