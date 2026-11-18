"use client";

import { useState } from "react";
import { Plus, RefreshCw, Clock3 } from "lucide-react";
import AddDropWindowTab from "./_components/AddDropWindowTab";
import UpdateDropWindowTab from "./_components/UpdateDropWindowTab";

type TabType = "ADD" | "UPDATE";

const TABS: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: "ADD", label: "Add Drop Off", icon: Plus },
  { key: "UPDATE", label: "Update Drop Off", icon: RefreshCw },
];

export default function DropWindowPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ADD");

  return (
    <div className="pb-24 md:pb-8 relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Drop Off Window
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure delivery windows and the time periods they apply to.
          </p>
        </div>

        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100 w-fit">
          <Clock3 className="w-4 h-4" />
          Drop Off Window Management
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
      {activeTab === "ADD" && <AddDropWindowTab />}
      {activeTab === "UPDATE" && <UpdateDropWindowTab />}
    </div>
  );
}