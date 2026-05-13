"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Analytics
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <BarChart3 className="w-4 h-4" />
          Metrics
        </span>
      </div>

      <div className="admin-card p-12 text-center shadow-sm">
        <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          We are currently building comprehensive charts and reporting tools to help you track Chop n&apos; Chop&apos;s performance metrics over time.
        </p>
      </div>
    </>
  );
}
