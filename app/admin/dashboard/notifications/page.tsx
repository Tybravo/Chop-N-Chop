"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Notifications
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Bell className="w-4 h-4" />
          Alerts
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
        <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No New Notifications</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          You&apos;re all caught up! When system alerts or urgent delivery issues occur, they will appear here.
        </p>
      </div>
    </>
  );
}
