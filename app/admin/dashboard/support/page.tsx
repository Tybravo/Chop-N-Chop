"use client";

import { Headset } from "lucide-react";

export default function SupportPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Help & Support
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Headset className="w-4 h-4" />
          Tickets
        </span>
      </div>

      <div className="admin-card p-12 text-center shadow-sm">
        <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Headset className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Support Tickets</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Manage customer and vendor support requests directly from this panel. Ticket assignment features coming soon.
        </p>
        <button className="bg-[#FC6B31] hover:bg-[#e35014] text-white px-6 py-2.5 rounded-lg transition-colors font-medium">
          View Open Tickets
        </button>
      </div>
    </>
  );
}
