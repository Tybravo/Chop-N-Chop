"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Wallet, Bell } from "lucide-react";

interface CustomerHeaderProps {
  walletBalance: number;
  notificationCount: number;
}

export default function CustomerHeader({ walletBalance, notificationCount }: CustomerHeaderProps) {
  const router = useRouter();

  return (
    <header className="md:hidden flex items-center justify-between gap-2 pt-2 relative z-10">
      <button
        type="button"
        onClick={() => router.push("/customer/profile")}
        aria-label="Open profile"
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-100 bg-white dark:border-zinc-700 dark:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
      >
        <Image
          src="/avatar-placeholder.svg"
          alt="Customer profile"
          width={44}
          height={44}
          className="h-full w-full object-cover"
        />
      </button>

      <button
        type="button"
        onClick={() => router.push("/customer/locations")}
        aria-label="Change delivery location"
        className="flex h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-full border border-gray-100 bg-gray-50 px-3 dark:border-zinc-800 dark:bg-zinc-900 hover:border-[#FC6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
      >
        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-[#FC6B31]">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          Delivering to
        </span>
        <span className="flex w-full items-center justify-center gap-1 truncate text-[12px] font-bold text-gray-900 dark:text-white">
          Yaba - Akoka
          <ChevronDown className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        {walletBalance > 0 && (
          <button
            type="button"
            onClick={() => router.push("/customer/wallet")}
            aria-label={`Open wallet, balance ${(walletBalance / 1000).toFixed(1)}k naira`}
            className="flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
          >
            <Wallet className="h-4 w-4" aria-hidden="true" />
            <span className="hidden text-[11px] font-extrabold sm:inline">₦{(walletBalance / 1000).toFixed(1)}k</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("/customer/notifications")}
          aria-label={`Open notifications, ${notificationCount} unread`}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FC6B31] text-[9px] font-black text-white dark:border-zinc-900">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
