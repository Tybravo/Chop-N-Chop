"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Desktop Image Grid
  const gridImages = Array.from({ length: 12 }).map((_, i) => 
    `https://source.unsplash.com/random/300x300?food,meal,nigerian&sig=${i + 15}`
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("chopnchop_session", "active");
    router.push("/customer/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8 selection:bg-[#FC6B31] selection:text-white">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-zinc-800">
        
        {/* LEFT PANEL: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Mobile Illustration */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="relative w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
               <img 
                 src="/hero-food-illustration.png" 
                 alt="ChopNChop Delivery" 
                 className="w-24 h-24 object-contain drop-shadow-lg"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/200x200/transparent/orange?text=Food"; }}
               />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <div className="w-8 h-8 bg-[#FC6B31] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ChopNChop</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Don't have an account?{" "}
              <Link href="/customer/signup" className="text-[#FC6B31] font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
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
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#FC6B31]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1 pb-1">
              <Link href="/customer/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-[#FC6B31] transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#FC6B31] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 hover:bg-orange-600 active:scale-[0.99] transition-all"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
            <span className="px-4 text-xs text-gray-400 font-medium">Or continue with</span>
            <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 dark:invert" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Apple</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Desktop Image Grid */}
        <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-zinc-950 p-4">
          <div className="w-full h-full rounded-[24px] overflow-hidden grid grid-cols-3 grid-rows-4 gap-2">
            {gridImages.map((src, idx) => (
              <div key={idx} className="relative w-full h-full overflow-hidden group bg-gray-200 dark:bg-zinc-800">
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