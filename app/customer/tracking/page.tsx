"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, MessageSquare, MapPin, Navigation2, CheckCircle2, ChefHat, Bike, Home } from "lucide-react";

export default function TrackingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col relative overflow-hidden">
      
      {/* =========================================
          1. HEADER & MAP BACKGROUND
      ========================================= */}
      {/* 
        This div simulates a map background using CSS patterns. 
        In production, replace this with a Google Maps or Mapbox component.
      */}
      <div className="absolute inset-0 z-0 bg-[#E5E3DF] dark:bg-[#1A1A1A] overflow-hidden">
        {/* Fake Map Grid & Roads */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Fake Route Line */}
        <svg className="absolute inset-0 w-full h-[60%] z-10" style={{ filter: 'drop-shadow(0 4px 6px rgba(252,107,49,0.3))' }}>
          <path d="M 100 150 Q 200 150 250 250 T 150 400" fill="none" stroke="#FC6B31" strokeWidth="6" strokeDasharray="10 10" strokeLinecap="round" className="animate-[dash_20s_linear_infinite]" />
        </svg>

        {/* Map Markers */}
        <div className="absolute top-[130px] left-[80px] z-20">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
            <ChefHat className="w-5 h-5 text-gray-900" />
          </div>
        </div>
        
        <div className="absolute top-[380px] left-[130px] z-20">
          <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#FC6B31] rounded-full animate-ping opacity-20" />
            <Home className="w-6 h-6 text-[#FC6B31]" />
          </div>
        </div>
      </div>

      {/* Floating Header */}
      <header className="relative z-50 px-4 py-5 flex items-center justify-between pointer-events-auto mt-safe">
        <button onClick={() => router.back()} className="p-3 bg-white dark:bg-zinc-900 shadow-md rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <div className="bg-white dark:bg-zinc-900 shadow-md px-5 py-2.5 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold text-[14px] text-gray-900 dark:text-white">Live Tracking</span>
        </div>
        <div className="w-11" />
      </header>

      {/* =========================================
          2. BOTTOM SHEET (Driver & Timeline)
      ========================================= */}
      <div className="relative z-40 mt-auto w-full animate-in slide-in-from-bottom-[100%] duration-500 pb-safe-offset-4">
        
        {/* Estimated Time Pill (Floating above the sheet) */}
        <div className="flex justify-center mb-4">
          <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-full px-6 py-3 flex items-center gap-3 border border-gray-100 dark:border-zinc-800">
            <div className="bg-orange-50 dark:bg-orange-500/10 p-2 rounded-full">
              <Clock className="w-4 h-4 text-[#FC6B31]" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Estimated Arrival</p>
              <p className="text-[16px] font-extrabold text-gray-900 dark:text-white">1:45 PM</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-black/50 border-t border-gray-100 dark:border-zinc-800 pt-8 pb-8 px-6 md:px-8 max-w-2xl mx-auto flex flex-col gap-8">
          
          {/* --- DRIVER PROFILE --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 shadow-md">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f3f4f6" 
                  alt="Driver" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">Michael O.</h3>
                <p className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <Navigation2 className="w-3.5 h-3.5" /> Courier • Honda Keke
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#FC6B31] flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-zinc-800" />

          {/* --- ORDER TIMELINE --- */}
          <div className="space-y-6">
            
            {/* Step 1: Placed */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="w-0.5 h-10 bg-green-500 -mb-2 mt-1" />
              </div>
              <div className="pt-1.5">
                <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">Order Confirmed</h4>
                <p className="text-[12px] text-gray-500">Your order has been received.</p>
              </div>
            </div>

            {/* Step 2: Preparing (Active State) */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#FC6B31] shadow-[0_0_0_4px_rgba(252,107,49,0.2)] flex items-center justify-center shrink-0 z-10">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div className="w-0.5 h-10 bg-gray-200 dark:bg-zinc-800 -mb-2 mt-1" />
              </div>
              <div className="pt-1.5">
                <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">Preparing your food</h4>
                <p className="text-[12px] text-gray-500">The kitchen is working on your meal.</p>
              </div>
            </div>

            {/* Step 3: Out for Delivery */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 z-10 border border-gray-200 dark:border-zinc-700">
                  <Bike className="w-4 h-4 text-gray-400" />
                </div>
                <div className="w-0.5 h-10 bg-gray-200 dark:bg-zinc-800 -mb-2 mt-1" />
              </div>
              <div className="pt-1.5 opacity-50">
                <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">Out for Delivery</h4>
                <p className="text-[12px] text-gray-500">Driver is on the way to Ikeja, Lagos.</p>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 z-10 border border-gray-200 dark:border-zinc-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="pt-1.5 opacity-50">
                <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">Delivered</h4>
                <p className="text-[12px] text-gray-500">Enjoy your meal!</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}