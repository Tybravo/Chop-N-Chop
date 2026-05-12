"use client";

import { Settings } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function SettingsPage() {
  const { user } = useAdminAuth();

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Settings className="w-4 h-4" />
          Preferences
        </span>
      </div>

      <div className="admin-card p-8 shadow-sm max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <input
                type="text"
                defaultValue={user?.role?.replace("_", " ") || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed font-semibold"
              />
            </div>
          </div>
          
          <hr className="border-gray-100 dark:border-gray-800 my-8" />
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter new password"
              />
            </div>
            <button className="bg-[#FC6B31] hover:bg-[#e35014] text-white px-6 py-2.5 rounded-lg transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
