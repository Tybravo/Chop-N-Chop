"use client";

import { useState, useEffect } from "react";
import { VendorSidebar } from "@/components/vendor/sidebar/VendorSidebar";
import { VendorHeader } from "@/components/vendor/header/VendorHeader";
import { BottomNavigation } from "@/components/vendor/navigation/BottomNavigation";
import { VendorBanner } from "@/components/vendor/header/VendorBanner";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Prevent horizontal scroll and zoom on mobile
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover");
    } else {
      const meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-black overflow-hidden font-sans">
      {/* Navbar at the top, full width */}
      <VendorHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <VendorBanner />

      {/* Below navbar: sidebar (left) + main content (right) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden lg:block">
          <VendorSidebar isOpen={false} onClose={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 overscroll-y-contain">
            <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>

          <BottomNavigation />
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="lg:hidden absolute z-[100] left-0 top-0 h-[100dvh]">
        <VendorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </div>
  );
}
