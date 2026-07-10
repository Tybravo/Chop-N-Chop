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
    <div className="flex h-[100dvh] bg-gray-50 dark:bg-black overflow-hidden font-sans">
      <VendorSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <VendorHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <VendorBanner />
        
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 overscroll-y-contain">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
