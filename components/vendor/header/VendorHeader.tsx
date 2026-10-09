"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Shield, Smile, SlidersHorizontal, LogOut, Headset, AlertTriangle, FileText, ToggleLeft, ToggleRight, ClipboardList } from "lucide-react";
import { useVendorAuth } from "@/context/VendorAuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SafeAvatar } from "@/components/SafeAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function VendorHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, updateUser, logout } = useVendorAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const vendorEmail = user?.email.replace(/[@.]/g, "_") || "";
  const base = `/vendor/${vendorEmail}`;

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

  const toggleStoreStatus = () => {
    if (user) {
      updateUser({ isStoreOnline: !user.isStoreOnline });
    }
  };

  const kycNeedsAttention = user && (user.kycStatus === "NOT_SUBMITTED" || user.kycStatus === "PENDING_REVIEW" || user.kycStatus === "REJECTED");

  const CENTER_LINKS = [
    { name: "Dashboard", href: `${base}/dashboard` },
    { name: "Kitchen/Menu", href: `${base}/meals` },
    { name: "Live Orders", href: `${base}/orders` },
    { name: "Wallet", href: `${base}/payout` },
  ];

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31]"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href={`${base}/dashboard`} className="flex items-center gap-2.5 group">
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
            <span className="hidden sm:inline">Vendor Only</span>
            <span className="sm:hidden">Vendor</span>
          </span>
        )}
      </div>

      {/* Center: Primary Operations (desktop only) */}
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

      <div className="flex items-center gap-3">
        {/* Store Status Toggle */}
        {user && (
          <button
            onClick={toggleStoreStatus}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label={user.isStoreOnline ? "Take store offline" : "Bring store online"}
            disabled={user.vendorStatus === "PENDING" || user.vendorStatus === "SUSPENDED" || !user.kycCompleted}
          >
            {user.isStoreOnline ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Offline</span>
              </>
            )}
          </button>
        )}

        {/* KYC Alert Badge */}
        {kycNeedsAttention && (
          <Link
            href={`${base}/kyc`}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800"
            title={user.kycStatus === "NOT_SUBMITTED" ? "Complete your KYC" : "Documents under review"}
          >
            {user.kycStatus === "NOT_SUBMITTED" ? (
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
              {user.kycStatus === "NOT_SUBMITTED" ? "Complete KYC" : "Under Review"}
            </span>
          </Link>
        )}

        {/* Manifest — routes to vendor production manifest */}
        <Link
          href={`${base}/manifest`}
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FC6B31] hover:bg-[#e55a2b] text-white text-sm font-bold tracking-wide shadow-sm transition-colors"
          aria-label="View production manifest"
        >
          <ClipboardList className="w-4 h-4" />
          Manifest
        </Link>

        <ThemeToggle />

        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#FC6B31] focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 transition-all block"
          >
            <SafeAvatar
              src={user?.logoUrl && user.logoUrl.trim() !== "" ? user.logoUrl : "/avatar-placeholder.svg"}
              alt="Vendor Profile"
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl py-8 px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-center">
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-1">{user?.businessName || "Vendor"}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{user?.email || "vendor@chopnchop.com"}</p>

              <div className="flex flex-col gap-3">
                <Link
                  href={`${base}/profile`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors"
                >
                  <Smile className="w-5 h-5 stroke-[1.5]" />
                  Business Profile
                </Link>

                <Link
                  href={`${base}/settings`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5 stroke-[1.5]" />
                  Settings
                </Link>

                <Link
                  href={`${base}/support`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#FC6B31] dark:bg-transparent dark:hover:bg-[#FC6B31] text-gray-700 hover:text-white dark:text-white border border-gray-200 dark:border-gray-700 hover:border-[#FC6B31] dark:hover:border-[#FC6B31] py-3 rounded-full font-medium transition-colors"
                >
                  <Headset className="w-5 h-5 stroke-[1.5]" />
                  Support
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

        {/* Mobile store toggle */}
        {user && (
          <button
            onClick={toggleStoreStatus}
            className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-[#FC6B31] transition-colors"
            aria-label={user.isStoreOnline ? "Take store offline" : "Bring store online"}
            disabled={user.vendorStatus === "PENDING" || user.vendorStatus === "SUSPENDED" || !user.kycCompleted}
          >
            {user.isStoreOnline ? (
              <ToggleRight className="w-6 h-6 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
