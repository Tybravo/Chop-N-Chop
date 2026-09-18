"use client";

import { useState } from "react";
import FloatingBottomNav from "@/components/customer/FloatingBottomNav";
import AIChatModal from "@/components/customer/AiChatModal";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 1. Exact match for root welcome page
  const isWelcomePage = pathname === "/customer";
  
  // 2. Use .startsWith() to catch nested routes (e.g., /customer/login/verify)
  const isAuthPage = pathname.startsWith("/customer/login") || 
                     pathname.startsWith("/customer/signup") || 
                     pathname.startsWith("/customer/forgot-password");
                     
  // 3. Catch the entire checkout flow, including the success page
  const isCheckoutFlow = pathname.startsWith("/customer/cart") || 
                         pathname.startsWith("/customer/checkout") || 
                         pathname.startsWith("/customer/success");
  
  const showGlobalUI = !isWelcomePage && !isAuthPage && !isCheckoutFlow;

  // Dynamically remove the bottom padding if the bottom nav is hidden
  const bottomPaddingClass = showGlobalUI 
    ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0" 
    : "pb-0";

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className={`flex flex-col relative selection:bg-[#FC6B31] selection:text-white ${isWelcomePage ? "h-[100dvh] overflow-hidden" : "min-h-screen"} bg-gray-50 dark:bg-zinc-950`}>
      
      {/* Container with dynamic padding based on UI visibility */}
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

      {/* The modal remains mounted to preserve chat history, just visually hidden when closed */}
      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} initialQuery="" />
      
      {showGlobalUI && <FloatingBottomNav />}
    </div>
  );
}