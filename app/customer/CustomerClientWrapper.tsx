"use client";

import { useState, Suspense, lazy } from "react";
import FloatingBottomNav from "@/components/customer/FloatingBottomNav";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const AIChatModal = lazy(() => import("@/components/customer/AiChatModal"));

export default function CustomerClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isWelcomePage = pathname === "/customer";
  
  const isAuthPage = pathname.startsWith("/customer/login") || 
                       pathname.startsWith("/customer/signup") || 
                       pathname.startsWith("/customer/forgot-pin");
                       
  const isCheckoutFlow = pathname.startsWith("/customer/cart") || 
                         pathname.startsWith("/customer/checkout") || 
                         pathname.startsWith("/customer/success");

  const isMiscellanous = pathname.startsWith("/customer/settings") ||
                         pathname.startsWith("/customer/profile");

  const isDropsPage = pathname.startsWith("/customer/drops");
  
  const showGlobalUI = !isWelcomePage && !isAuthPage && !isCheckoutFlow && !isMiscellanous && !isDropsPage;

  const bottomPaddingClass = showGlobalUI 
    ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0" 
    : "pb-0";

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className={`flex flex-col relative selection:bg-[#FC6B31] selection:text-white ${isWelcomePage ? "h-[100dvh] overflow-hidden" : "min-h-screen"} bg-gray-50 dark:bg-zinc-950`}>
      
      <div className={`flex-1 ${isWelcomePage ? "min-h-0 overflow-hidden" : `overflow-x-hidden ${bottomPaddingClass}`}`}>
        {children}
      </div>

      {showGlobalUI && (
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-24 right-4 z-40 bg-[#FC6B31] text-white p-3.5 rounded-full shadow-2xl hover:bg-orange-600 transition-all ring-4 ring-orange-500/20 active:scale-95"
          aria-label="Open AI Concierge"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      <Suspense fallback={null}>
        <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} initialQuery="" />
      </Suspense>
      
      {showGlobalUI && <FloatingBottomNav />}
    </div>
  );
}