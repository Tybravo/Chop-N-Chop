"use client";

import FloatingBottomNav from "@/components/customer/FloatingBottomNav";
import { usePathname } from "next/navigation";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWelcomePage = pathname === "/customer";
  const showBottomNav = !isWelcomePage;

  return (
    <div
      className={`flex flex-col relative selection:bg-[#FC6B31] selection:text-white ${
        isWelcomePage ? "h-[100dvh] overflow-hidden" : "min-h-screen"
      } bg-gray-50 dark:bg-zinc-950`}
    >
      <div className={`flex-1 ${isWelcomePage ? "min-h-0 overflow-hidden" : "pb-24"}`}>
        {children}
      </div>

      {showBottomNav && <FloatingBottomNav />}
    </div>
  );
}
