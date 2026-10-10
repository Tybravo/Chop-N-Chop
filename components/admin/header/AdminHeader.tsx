"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search, Shield, Smile, SlidersHorizontal, LogOut, Bell } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SafeAvatar } from "@/components/SafeAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminHeader() {
  const { user, logout } = useAdminAuth();
  const pathname = usePathname();
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

  const CENTER_LINKS = [
    { name: "Overview", href: "/admin/dashboard" },
    { name: "Vendors", href: "/admin/dashboard/vendors" },
    { name: "Deliveries", href: "/admin/dashboard/riders" },
    { name: "Finance", href: "/admin/dashboard/transactions" },
    { name: "Customers", href: "/admin/dashboard/customers" },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <Image
            src="/logo_icon.png"
            alt="Chop n Chop Icon"
            width={40}
            height={40}
            className="w-7 h-7 md:w-9 md:h-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <Image
            src="/Chopnchop.png"
            alt="Chop n Chop Text"
            width={120}
            height={28}
            className="w-auto h-5 md:h-[26px] object-contain mt-1"
            priority
          />
        </Link>
        
        {user && (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-shadow">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user.role === "SUPER_ADMIN" ? "Super Admin Only" : "Admin Only"}
            </span>
            <span className="sm:hidden">
              {user.role === "SUPER_ADMIN" ? "Super" : "Admin"}
            </span>
          </span>
        )}
      </div>

      {/* Center: Global Management (desktop only) */}
      <nav className="hidden md:flex items-center gap-1 xl:gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {CENTER_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? "text-[#FC6B31] bg-orange-50 dark:bg-orange-950/30 font-bold"
                  : "hover:text-[#FC6B31] hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="relative w-48 lg:w-64 hidden xl:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FC6B31] focus:border-transparent sm:text-sm"
            placeholder="Search orders by ID, customer name"
          />
        </div>

        <ThemeToggle />

        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#FC6B31] focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 transition-all block"
          >
            <SafeAvatar
              src={user?.avatarUrl && user.avatarUrl.trim() !== "" ? user.avatarUrl : "/avatar-placeholder.svg"}
              alt="Admin Profile"
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-4xl shadow-2xl py-8 px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-center">
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
                  <LogOut className="w-5 h-5 stroke-[1.5]" />
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
