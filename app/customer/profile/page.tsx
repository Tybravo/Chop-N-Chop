"use client";

import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Wallet, 
  Heart, 
  Headphones, 
  LogOut, 
  ChevronRight,
  ChevronLeft, 
  Truck, 
  Package,
  ShieldCheck,
  Car,
  Ticket,
  Settings
} from "lucide-react";
import DesktopProfileDashboard from "./desktop-profile";

export default function ProfilePage() {
  const router = useRouter();

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
                type="button"
                onClick={() => router.back()}
                className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
                aria-label="Go back to the previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Profile</h1>
              <div className="w-10 h-10" /> {/* Empty div to perfectly center the title */}
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
                    src="/avatar-placeholder.svg"
                    alt=""
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

            {/* BLOCK 1: THE ESSENTIALS */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/wallet")}
                aria-label="Open wallet and quick pay"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
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

              <button
                type="button"
                onClick={() => router.push("/customer/drops")}
                aria-label="Open drops and order history"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
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

              <button
                type="button"
                onClick={() => router.push("/customer/promos")}
                aria-label="Open promos and rewards"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Promos & Rewards</span>
                    <span className="text-[11px] text-gray-400">Active discounts & coupons</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* BLOCK 2: OPERATIONAL PREFERENCES */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/locations")}
                aria-label="Open saved hubs and locations"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
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

              <button
                type="button"
                onClick={() => router.push("/customer/vehicles")}
                aria-label="Open drive-thru vehicles"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Drive-Thru Vehicles</span>
                    <span className="text-[11px] text-gray-400">Make, color & plate numbers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/favorites")}
                aria-label="Open favorites and quick reorder"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
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
            </div>

            {/* BLOCK 3: SETTINGS & SUPPORT */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/settings")}
                aria-label="Open app settings and preferences"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">App Settings & Preferences</span>
                    <span className="text-[11px] text-gray-400">Dark mode, notifications, security</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => window.open("https://wa.me/2348172028728", "_blank")}
                aria-label="Contact instant support on WhatsApp"
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
              >
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
            </div>

            {/* STANDALONE LOGOUT */}
            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("chopnchop_session");
                  localStorage.removeItem("chopnchop-session");
                  router.push("/customer/login");
                }}
                aria-label="Log out of your account"
                className="min-h-12 w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-[15px] font-extrabold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}