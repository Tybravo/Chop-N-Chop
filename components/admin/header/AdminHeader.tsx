"use client";

import { useState, useRef, useEffect } from "react";
import { LayoutGrid, Search, Shield, Smile, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function AdminHeader() {
  const { user, logout } = useAdminAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 text-gray-500">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-5 h-5" />
          <span className="font-semibold text-gray-600 tracking-wide">OVERVIEW</span>
        </div>
        
        {user && (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-shadow">
            <Shield className="w-4 h-4" />
            {user.role === "SUPER_ADMIN" ? "Super Admin Only" : "Admin Only"}
          </span>
        )}
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

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#FC6B31] focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 transition-all block"
          >
            <Image
              src={user?.avatarUrl && user.avatarUrl.trim() !== "" ? user.avatarUrl : "https://i.pravatar.cc/150?img=47"}
              alt="Admin Profile"
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl py-8 px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-center">
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-1">{user?.name || "Admin User"}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{user?.email || "admin@chopnchop.com"}</p>
              
              <div className="flex flex-col gap-3">
                <Link 
                  href="/admin/dashboard/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors"
                >
                  <Smile className="w-5 h-5 stroke-[1.5]" />
                  Profile
                </Link>
                
                <Link 
                  href="/admin/dashboard/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5 stroke-[1.5]" />
                  Settings
                </Link>

                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
