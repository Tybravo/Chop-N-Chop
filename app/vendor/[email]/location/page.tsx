"use client";

import { useState } from "react";
import { LocateFixed, MousePointerClick, MapPin } from "lucide-react";
import AutoUpdateTab from "./_components/AutoUpdateTab";
import ManualUpdateTab from "./_components/ManualUpdateTab";

type TabType = "AUTO" | "MANUAL";

const TABS: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: "AUTO", label: "Auto Update", icon: LocateFixed },
  { key: "MANUAL", label: "Manual Update", icon: MousePointerClick },
];

export default function VendorUpdateLocationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("AUTO");

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Update Location
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set the Hub and Zone your store operates from — automatically via your device location, or manually.
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100 w-fit">
          <MapPin className="w-4 h-4" />
          Vendor Location
        </span>
      </div>

      {/* Tab Navigation Card */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-6 bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                isActive
                  ? "bg-[#FC6B31] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content — Auto is the default/first tab */}
      {activeTab === "AUTO" && <AutoUpdateTab />}
      {activeTab === "MANUAL" && <ManualUpdateTab />}
    </div>
  );
}