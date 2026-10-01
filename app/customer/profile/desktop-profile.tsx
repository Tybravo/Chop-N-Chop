"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Wallet, 
  FileText, 
  Download, 
  Plus, 
  ExternalLink,
  Car,
  Ticket,
  Settings,
  ShieldAlert
} from "lucide-react";
import { UserProfile } from "./page";

interface DesktopProfileProps {
  profile: UserProfile | null;
  isLoading: boolean;
  avatarUrl: string;
}

export default function DesktopProfileDashboard({ profile, isLoading, avatarUrl }: DesktopProfileProps) {
  const [activeTab, setActiveTab] = useState("orders");
  
  // FIX 1: Lazily initialize state to prevent synchronous setState warning on mount
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    // Only update if it somehow changes externally to prevent cascading renders
    const isDark = document.documentElement.classList.contains("dark");
    if (isDarkMode !== isDark) {
      setIsDarkMode(isDark);
    }
  }, [isDarkMode]);

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

  const pastOrders = [
    { id: "ORD-9281", date: "Sep 16, 2026", items: "Smoky Jollof & Chicken (2x)", vendor: "Taste & See", total: "₦11,000", status: "Delivered" },
    { id: "ORD-9104", date: "Sep 14, 2026", items: "Fluffy Yam & Eggs", vendor: "Lagos Mainland Kitchen", total: "₦3,500", status: "Delivered" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-5">
          {/* FIX 2: Replaced <img> with Next.js <Image> for performance. Added 'relative' to the parent div. */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FC6B31]/20 shrink-0 shadow-sm bg-orange-50 relative">
            <Image 
              src={avatarUrl || "/avatar-placeholder.svg"} 
              alt="Profile Avatar" 
              fill
              unoptimized // Added since external Cloudinary URLs might not be configured in next.config.js yet
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {isLoading 
                ? "Loading Profile..." 
                : profile ? `Welcome back, ${profile.firstName}` : "Account & Ledger"
              }
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage security credentials, vehicle profiles, corporate invoices, and saved hubs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === "CORPORATE" && (
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
               Corporate Account Active
             </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 h-fit shadow-sm">
          {[
            { id: "orders", label: "Detailed Order Ledger", icon: FileText },
            { id: "wallet", label: "Wallet & Transactions", icon: Wallet },
            { id: "promos", label: "Promos & Rewards", icon: Ticket },
            { id: "locations", label: "Hub Management", icon: MapPin },
            { id: "vehicles", label: "Drive-Thru Vehicles", icon: Car },
            { id: "settings", label: "App Settings & Security", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-[#FC6B31] text-white shadow-md shadow-orange-500/20" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">

          {activeTab === "orders" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Order Ledger</h2>
                <button className="flex items-center gap-2 text-xs font-bold text-[#FC6B31] border border-[#FC6B31]/30 px-3.5 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                  <Download className="w-4 h-4" /> Download All PDF Receipts
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-400 font-semibold text-xs uppercase">
                    <tr>
                      <th className="p-4 rounded-l-xl">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items / Batch</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 rounded-r-xl">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {pastOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{ord.id}</td>
                        <td className="p-4 text-gray-500">{ord.date}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{ord.items}</td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{ord.total}</td>
                        <td className="p-4">
                          <button className="text-xs font-bold text-[#FC6B31] hover:underline flex items-center gap-1">
                            PDF <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Wallet Ledger</h2>
                  <p className="text-xs text-gray-500 mt-1">Current Balance: <span className="font-bold text-emerald-600">₦24,500</span></p>
                </div>
                <button className="bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-orange-600 transition-colors">
                  Fund Wallet
                </button>
              </div>
              <div className="text-xs text-gray-400 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl text-center border border-dashed border-gray-200 dark:border-zinc-700">
                Detailed transaction funding and refund history ledger is synchronized with your bank.
              </div>
            </div>
          )}

          {activeTab === "promos" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Promos & Rewards</h2>
              
              <div className="flex gap-3">
                <input type="text" placeholder="Enter Promo Code" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md">
                  Apply
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-pink-500 uppercase tracking-wider">Active</span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">10% Off First Drops</h4>
                  </div>
                  <Ticket className="w-6 h-6 text-pink-500/30" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "locations" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Advanced Hub Management</h2>
                <button className="flex items-center gap-2 bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors hover:bg-orange-600">
                  <Plus className="w-4 h-4" /> Add New Hub
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-[#FC6B31] bg-orange-50/20 dark:bg-orange-950/10 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FC6B31] uppercase tracking-wider">Primary Office Hub</span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Victoria Island Corporate Tower</h4>
                  <p className="text-xs text-gray-500">Floor 4, Reception Drop Zone • Delivery Note: Call upon arrival</p>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Residential Hub</span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Lekki Phase 1 Residence</h4>
                  <p className="text-xs text-gray-500">Gate 3, Street 42 • Delivery Note: Leave with security</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Saved Drive-Thru Vehicles</h2>
                  <p className="text-xs text-gray-500 mt-1">Used to identify your car during hub/drive-thru pickups.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors hover:bg-orange-600">
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Mercedes-Benz ML500</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Silver • KJA-203XX</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full uppercase">
                    Primary
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
              
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">App Settings & Preferences</h2>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Dark Mode</span>
                    <span className="text-xs text-gray-500">Adjust application appearance</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isDarkMode}
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isDarkMode ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-700"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isDarkMode ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">SMS Alerts for Dispatch</span>
                    <span className="text-xs text-gray-500">Receive text messages when rider approaches</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#FC6B31] w-4 h-4 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-gray-400" /> Account Security
                </h2>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Biometric Login (FaceID / Fingerprint)</span>
                    <span className="text-xs text-gray-500">Use biometrics to authorize wallet payments</span>
                  </div>
                  <input type="checkbox" className="accent-[#FC6B31] w-4 h-4 cursor-pointer" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Update Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">4-Digit Wallet PIN</label>
                    <input type="password" placeholder="••••" maxLength={4} className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Save Security Changes
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}