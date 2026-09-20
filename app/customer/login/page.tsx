"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({ identifier: "", pin: "" });

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, pin: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = formData.identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?[0-9]{10,14}$/.test(identifier); 

    if (!isEmail && !isPhone) {
      alert("Please enter a valid email address or phone number.");
      return;
    }
    if (formData.pin.length !== 4) {
      alert("PIN must be exactly 4 digits.");
      return;
    }
    
    localStorage.setItem("chopnchop_session", "active");
    router.push("/customer/home");
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FFFBF7] flex items-center justify-center p-4 lg:p-8 overflow-hidden selection:bg-[#FC6B31] selection:text-white animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <div className="w-full max-w-5xl h-full lg:h-auto lg:max-h-[720px] bg-white rounded-[28px] lg:rounded-[40px] shadow-sm lg:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row border border-orange-100/60 overflow-hidden relative">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 px-6 py-5 lg:p-12 flex flex-col h-full justify-between overflow-hidden">
          
          {/* Header Title (35px) */}
          <div className="text-center shrink-0 pt-1">
            <h2 className="font-black text-gray-900 tracking-tight text-[35px] leading-tight">Welcome Back</h2>
          </div>

          {/* Mobile Illustration & Subtext (16px) */}
          <div className="w-full flex flex-col items-center lg:hidden shrink-0 my-1">
            <div className="flex min-h-[150px] max-h-[210px] w-full justify-center items-center overflow-hidden mb-2">
              <img src="/CNC-bowl of jolof rice chicken plantain.png" alt="ChopnChop Jollof Rice Dish" className="max-h-full w-auto max-w-[340px] object-contain drop-shadow-md" />
            </div>
            <p className="text-gray-500 font-medium text-center text-[16px]">Log in to continue your food journey.</p>
          </div>

          {/* Desktop-only Subtext (16px) */}
          <div className="hidden lg:block text-center shrink-0">
            <p className="text-gray-500 font-medium text-[16px]">Log in to continue your food journey.</p>
          </div>

          {/* Form Fields */}
          <div className="w-full max-w-sm mx-auto shrink-0 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text" required placeholder="Email or Phone Number"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-[48px] pr-4 py-3 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPin ? "text" : "password"} inputMode="numeric" pattern="\d{4}" maxLength={4} required
                  placeholder="4-Digit PIN"
                  value={formData.pin}
                  onChange={handlePinChange}
                  className="w-full pl-[48px] pr-12 py-3 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[14px] font-mono tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[13px] pt-0.5 px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 accent-[#FC6B31] rounded" />
                  <span className="text-gray-600 font-medium">Remember me</span>
                </label>
                <Link href="/customer/forgot-pin" className="font-extrabold text-[#FC6B31] hover:underline">Forgot PIN?</Link>
              </div>

              <div className="pt-1">
                <button type="submit" className="w-full py-3.5 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[18px] lg:rounded-[20px] shadow-lg shadow-orange-500/30 transition-all text-[15px] tracking-wide active:scale-[0.98]">
                  Log In
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <p className="text-gray-500 font-medium text-[16px]">
                Don&apos;t have an account? <Link href="/customer/signup" className="font-extrabold text-[#FC6B31] hover:underline">Sign Up</Link>
              </p>
            </div>
          </div>

          <div className="shrink-0 h-1" />
        </div>

        {/* RIGHT PANEL: Desktop Ambient Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#FDF7F2] p-8 items-center justify-center relative overflow-hidden border-l border-orange-100/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/30 pointer-events-none" />
          <img src="/CNC-man riding bike.png" alt="ChopnChop Rider Delivery" className="w-full h-full max-h-[500px] object-contain relative z-10 drop-shadow-xl transform hover:scale-105 transition-transform duration-700" />
        </div>

      </div>
    </div>
  );
}