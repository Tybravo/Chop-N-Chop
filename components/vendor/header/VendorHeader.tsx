"use client";

import { Menu, Bell } from "lucide-react";
import { useVendorAuth } from "@/context/VendorAuthContext";
import Image from "next/image";

export function VendorHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useVendorAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31]"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          {user?.logoUrl ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <Image src={user.logoUrl} alt="Logo" width={32} height={32} className="object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#FC6B31]/10 flex items-center justify-center text-[#FC6B31] font-bold">
              {user?.businessName?.charAt(0) || "V"}
            </div>
          )}
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
            {user?.businessName || "Vendor"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>
      </div>
    </header>
  );
}
