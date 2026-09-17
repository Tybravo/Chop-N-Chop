"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, RotateCcw } from "lucide-react";

export default function DropsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const pastDrops = [
    { id: "ORD-9281", date: "Sep 16", meal: "Smoky Jollof & Chicken (2x)", vendor: "Taste & See", total: "₦11,000", status: "Delivered" },
    { id: "ORD-9104", date: "Sep 14", meal: "Fluffy Yam & Eggs", vendor: "Lagos Mainland Kitchen", total: "₦3,500", status: "Delivered" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32 pt-4 px-4 md:px-8 selection:bg-[#FC6B31] selection:text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <header className="pt-2">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Drops</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track active deliveries and review your meal history.</p>
        </header>

        {/* TABS */}
        <div className="flex bg-gray-200/50 dark:bg-zinc-900 rounded-full p-1 border border-gray-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === "active"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Active Drops (1)
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === "past"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Past Drops
          </button>
        </div>

        {/* ACTIVE TAB CONTENT */}
        {activeTab === "active" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              
              {/* Tracker Header */}
              <div className="bg-[#FC6B31] p-5 text-white flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full block w-fit mb-2">
                    Arriving Today
                  </span>
                  <h2 className="text-lg font-extrabold leading-tight">Smoky Party Jollof & Turkey</h2>
                  <p className="text-xs text-orange-100 mt-1">Taste & See Kitchen • 1 Item</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-medium text-orange-100 uppercase mb-0.5">Drop Window</span>
                  <span className="block text-sm font-extrabold bg-white text-[#FC6B31] px-3 py-1 rounded-lg">1:30 PM - 2:00 PM</span>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 dark:border-zinc-800 ml-4 space-y-8">
                  
                  {/* Step 1: Confirmed */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Order Confirmed</h3>
                    <p className="text-xs text-gray-500 mt-1">11:00 AM • Vendor has acknowledged your pre-order.</p>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <Package className="w-3 h-3 text-white" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Batching & Preparing</h3>
                    <p className="text-xs text-gray-500 mt-1">12:15 PM • Your meal is being prepared and batched for the hub drop.</p>
                  </div>

                  {/* Step 3: Out for Delivery (Active) */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-orange-100 dark:bg-orange-900/30 border-2 border-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <span className="w-2 h-2 bg-[#FC6B31] rounded-full animate-pulse" />
                    </span>
                    <h3 className="text-sm font-bold text-[#FC6B31]">Out for Delivery</h3>
                    <p className="text-xs text-gray-500 mt-1">Driver is currently en route to your selected hub.</p>
                  </div>

                  {/* Step 4: Arrived (Pending) */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-gray-100 dark:bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <MapPin className="w-3 h-3 text-gray-400" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-400">Ready at Hub</h3>
                    <p className="text-xs text-gray-400 mt-1">Pending arrival at Victoria Island Corporate Tower.</p>
                  </div>

                </div>
              </div>

              {/* Action Area */}
              <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 flex gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50">
                  View Receipt
                </button>
                <button className="flex-1 bg-[#FC6B31] text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                  Contact Driver
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PAST TAB CONTENT */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastDrops.map((drop) => (
              <div key={drop.id} className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start border-b border-gray-50 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{drop.meal}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{drop.vendor} • {drop.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-extrabold text-gray-900 dark:text-white">{drop.total}</span>
                    <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-1">
                      {drop.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Reorder
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    Rate Meal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}