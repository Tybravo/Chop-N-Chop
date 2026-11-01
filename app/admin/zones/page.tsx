"use client";

import { useState } from "react";
import { MapPin, Plus, RefreshCw, Power } from "lucide-react";
import AddZoneTab from "./_components/AddZoneTab";
import UpdateZoneTab from "./_components/UpdateZoneTab";
import ChangeStatusTab from "./_components/ChangeStatusTab";

type TabType = "ADD" | "UPDATE" | "STATUS";

const TABS: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: "ADD", label: "Add Zone", icon: Plus },
  { key: "UPDATE", label: "Update Zone", icon: RefreshCw },
  { key: "STATUS", label: "Change Status", icon: Power },
];

export default function ZonesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ADD");

  return (
    <div className="pb-24 md:pb-8 relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Manage Zone
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, update, and control the statuses of delivery zones.
          </p>
        </div>

        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100 w-fit">
          <MapPin className="w-4 h-4" />
          Zone Management
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

      {/* Tab Content */}
      {activeTab === "ADD" && <AddZoneTab />}
      {activeTab === "UPDATE" && <UpdateZoneTab />}
      {activeTab === "STATUS" && <ChangeStatusTab />}
    </div>
  );
}
