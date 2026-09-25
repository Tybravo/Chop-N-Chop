"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Wallet, Bell, Clock } from "lucide-react";
import { useOrderContext } from "@/store/useOrderContext";
import { useNotifications } from "@/context/NotificationContext";

interface CustomerHeaderProps {
  walletBalance: number;
  notificationCount?: number;
  isAuthenticated?: boolean;
  avatarUrl?: string | null;
}

const WINDOW_LABELS: Record<string, string> = {
  'today-lunch': 'Today • 12-2 PM',
  'today-dinner': 'Today • 6-8 PM',
  'tomorrow-lunch': 'Tmrw • 12-2 PM',
};

export default function CustomerHeader({ 
  walletBalance, 
  isAuthenticated, 
  avatarUrl 
}: CustomerHeaderProps) {
  const router = useRouter();
  const { location, deliveryWindow, resetContext } = useOrderContext();
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayLocation = location || "Select Zone";
  const displayWindow = deliveryWindow && WINDOW_LABELS[deliveryWindow]
    ? WINDOW_LABELS[deliveryWindow]
    : "Select Drop Window";

  if (!mounted) {
    return <div className="h-[52px] w-full animate-pulse bg-gray-50 dark:bg-zinc-900 rounded-full md:hidden mt-2" />;
  }

  return (
    <header className="md:hidden flex items-center justify-between gap-2 pt-2 relative z-10">
      
      {/* Conditionally render the profile picture only if authenticated */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={() => router.push("/customer/profile")}
          aria-label="Open profile"
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-100 bg-white dark:border-zinc-700 dark:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
        >
          {/* Using standard img instead of Next Image to prevent external domain errors with Cloudinary URLs */}
          <img
            src={avatarUrl || "/avatar-placeholder.svg"}
            alt="Customer profile"
            className="h-full w-full object-cover"
          />
        </button>
      )}

      {/* Dynamic Context Gateway Trigger */}
      <button
        type="button"
        onClick={() => {
          resetContext();
        }}
        aria-label="Change delivery location and window"
        className="flex h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-full border border-gray-100 bg-gray-50 px-2 dark:border-zinc-800 dark:bg-zinc-900 hover:border-[#FC6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
      >
        <span className="flex w-full items-center justify-center gap-1 text-[10px] font-extrabold uppercase text-[#FC6B31]">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{displayLocation}</span>
        </span>
        <span className="flex w-full items-center justify-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
          <Clock className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
          <span className="truncate">{displayWindow}</span>
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
          aria-label={`Open notifications, ${unreadCount} unread`}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FC6B31] text-[9px] font-black text-white dark:border-zinc-900">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}