"use client";

import { LayoutGrid, Search } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2 text-gray-500">
        <LayoutGrid className="w-5 h-5" />
        <span className="font-semibold text-gray-600 tracking-wide">OVERVIEW</span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative w-80 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FC6B31] focus:border-transparent sm:text-sm"
            placeholder="Search orders by ID, customer name"
          />
        </div>

        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Admin Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
