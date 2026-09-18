"use client";

import { useState } from "react";
import FloatingBottomNav from "@/components/customer/FloatingBottomNav";
import AIChatModal from "@/components/customer/AiChatModal";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWelcomePage = pathname === "/customer";
  const isAuthPage = pathname === "/customer/login" || pathname === "/customer/signup" || pathname === "/customer/forgot-password";
  const showBottomNav = !isWelcomePage && !isAuthPage;

  // AI Chat Modal States
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState("");

  return (
    <div
      className={`flex flex-col relative selection:bg-[#FC6B31] selection:text-white ${
        isWelcomePage ? "h-[100dvh] overflow-hidden" : "min-h-screen"
      } bg-gray-50 dark:bg-zinc-950`}
    >
      <div className={`flex-1 ${isWelcomePage ? "min-h-0 overflow-hidden" : "overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0"}`}>
        {children}
      </div>

      {/* Floating AI Button */}
      {showBottomNav && (
        <button
          onClick={() => {
            setAiInitialQuery("");
            setIsAIChatOpen(true);
          }}
          className="fixed bottom-24 right-4 z-40 bg-[#FC6B31] text-white p-3.5 rounded-full shadow-2xl hover:bg-orange-600 transition-all flex items-center justify-center group ring-4 ring-orange-500/20 active:scale-95"
          aria-label="Open AI Concierge"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Persistent AI Chat Modal Drawer */}
      <AIChatModal 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
        initialQuery={aiInitialQuery}
      />

      {showBottomNav && <FloatingBottomNav />}
    </div>
  );
}