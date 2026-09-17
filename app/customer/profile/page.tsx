"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Wallet, 
  Bell, 
  Heart, 
  Headphones, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Sun, 
  Truck, 
  Package,
  ShieldCheck,
} from "lucide-react";
import DesktopProfileDashboard from "./desktop-profile";

export default function ProfilePage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* Desktop Profile - shown on md+ screens */}
      <div className="hidden md:block">
        <DesktopProfileDashboard />
      </div>

      {/* Mobile Profile - shown on small screens */}
      <div className="md:hidden">
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32 pt-4 px-4 selection:bg-[#FC6B31] selection:text-white">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* TOP HEADER */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm"
              >
                ←
              </button>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Profile</h1>
              <button 
                onClick={() => {
                  localStorage.removeItem("chopnchop_session");
                  router.push("/customer/login");
                }}
                className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-500 shadow-sm"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* ACTIVE DROP STATUS WIDGET */}
            <div className="bg-gradient-to-r from-[#FC6B31] to-orange-600 rounded-[24px] p-4 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  Live Scheduled Drop
                </span>
                <Truck className="w-4 h-4 animate-bounce" />
              </div>
              <h3 className="text-sm font-bold">1 Pending Delivery Today</h3>
              <p className="text-[11px] text-orange-100 mt-0.5">Smoky Party Jollof & Turkey • Arriving 1:30 PM</p>
            </div>

            {/* CORE IDENTITY CARD */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-4 border border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FC6B31]/30 bg-orange-50">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDaniel&backgroundColor=f3f4f6" 
                    alt="John-Daniel" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 dark:text-white">John-Daniel Ikechukwu</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john.daniel@chopnchop.ng</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="w-3 h-3" /> Phone Verified
                  </span>
                </div>
              </div>
            </div>

            {/* THEME TOGGLE CARD */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] px-4 py-3.5 border border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-gray-800 dark:text-zinc-200">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-orange-500" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Adjust app appearance</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#FC6B31]"></div>
              </label>
            </div>

            {/* GROUPED NAVIGATION CARD 1 */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button onClick={() => router.push("/customer/wallet")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FC6B31] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Wallet & Quick Pay</span>
                    <span className="text-[11px] text-gray-400">Balance: ₦24,500</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={() => router.push("/customer/locations")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Saved Hubs & Locations</span>
                    <span className="text-[11px] text-gray-400">Office, Home & Drop zones</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={() => router.push("/customer/favorites")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Favorites & Quick Reorder</span>
                    <span className="text-[11px] text-gray-400">Saved meals and vendors</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={() => router.push("/customer/notifications")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Notification Toggles</span>
                    <span className="text-[11px] text-gray-400">Cut-off times & arrival alerts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* GROUPED NAVIGATION CARD 2 */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button onClick={() => window.open("https://wa.me/2348000000000", "_blank")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Instant Support</span>
                    <span className="text-[11px] text-gray-400">WhatsApp Coordinator & FAQ</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={() => router.push("/customer/drops")} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Drops & Order History</span>
                    <span className="text-[11px] text-gray-400">Track drops and view past receipts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}