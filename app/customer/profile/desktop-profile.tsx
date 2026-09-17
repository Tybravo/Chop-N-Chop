"use client";

import { useState } from "react";
import { 
  User, 
  Lock, 
  MapPin, 
  Wallet, 
  Bell, 
  FileText, 
  Shield, 
  Download, 
  CheckCircle2, 
  Plus, 
  ExternalLink 
} from "lucide-react";

export default function DesktopProfileDashboard() {
  const [activeTab, setActiveTab] = useState("security");

  const pastOrders = [
    { id: "ORD-9281", date: "Sep 16, 2026", items: "Smoky Jollof & Chicken (2x)", vendor: "Taste & See", total: "₦11,000", status: "Delivered" },
    { id: "ORD-9104", date: "Sep 14, 2026", items: "Fluffy Yam & Eggs", vendor: "Lagos Mainland Kitchen", total: "₦3,500", status: "Delivered" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Account & Ledger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage security credentials, corporate invoice ledgers, and saved hub delivery locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
            Corporate Account Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 h-fit shadow-sm">
          {[
            { id: "security", label: "Security & Credentials", icon: Lock },
            { id: "orders", label: "Detailed Order Ledger", icon: FileText },
            { id: "locations", label: "Advanced Hub Management", icon: MapPin },
            { id: "wallet", label: "Wallet & Transactions", icon: Wallet },
            { id: "notifications", label: "Communication Prefs", icon: Bell },
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
          
          {activeTab === "security" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Expanded Account Security</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                </div>
                <button className="bg-[#FC6B31] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Corporate Order Ledger</h2>
                <button className="flex items-center gap-2 text-xs font-bold text-[#FC6B31] border border-[#FC6B31]/30 px-3.5 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30">
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

          {activeTab === "locations" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Advanced Hub Management</h2>
                <button className="flex items-center gap-2 bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md">
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

          {activeTab === "wallet" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Wallet Ledger</h2>
                  <p className="text-xs text-gray-500 mt-1">Current Balance: <span className="font-bold text-emerald-600">₦24,500</span></p>
                </div>
                <button className="bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl">
                  Fund Wallet
                </button>
              </div>
              <div className="text-xs text-gray-400 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl text-center">
                Detailed transaction funding and refund history ledger is synchronized with your bank.
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Granular Communication Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">SMS Alerts for Dispatch & Hub Arrival</span>
                  <input type="checkbox" defaultChecked className="accent-[#FC6B31] w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Weekly Meal Schedule Digests</span>
                  <input type="checkbox" defaultChecked className="accent-[#FC6B31] w-4 h-4" />
                </label>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}