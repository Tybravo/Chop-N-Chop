"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  ShoppingBag,
  UserRound,
} from "lucide-react";

export default function FloatingBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/customer/home", icon: Home },
    { name: "Explore", path: "/customer/explore", icon: Compass },
    { name: "Cart", path: "/customer/cart", icon: ShoppingBag, badge: "2" },
    { name: "Profile", path: "/customer/profile", icon: UserRound },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none md:hidden">
      
      <div className="relative w-full max-w-[360px] h-[58px] pointer-events-auto drop-shadow-[0_12px_25px_rgba(0,0,0,0.15)]">

        {/* =========================================
            LAYER 1: WHITE OUTLINE 
            ========================================= */}
        <div className="absolute inset-0 z-0 flex items-center">
          {/* Connecting Bridge */}
          <div className="absolute left-[29px] right-[29px] h-[42px] bg-white" />
          {/* The 5 Outer Nodes */}
          <div className="w-full flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[58px] h-[58px] bg-white rounded-full shrink-0" />
            ))}
          </div>
        </div>

        {/* =========================================
            LAYER 2: INNER FILL 
            (Slightly lighter ash `bg-zinc-200` on light mode, 
             and `#27272A` on dark mode)
            ========================================= */}
        <div className="absolute inset-0 z-10 flex items-center px-[4px]">
          {/* Connecting Bridge */}
          <div className="absolute left-[29px] right-[29px] h-[34px] bg-zinc-200 dark:bg-[#27272A]" />
          {/* The 4 Inner Nodes */}
          <div className="w-full flex justify-between relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[50px] h-[50px] bg-zinc-200 dark:bg-[#27272A] rounded-full shrink-0" />
            ))}
          </div>
        </div>

        {/* =========================================
            LAYER 3: INTERACTIVE FOREGROUND BUTTONS
            ========================================= */}
        <nav className="absolute inset-0 z-20 flex items-center justify-between px-[4px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path !== "/customer/home" &&
                pathname?.startsWith(item.path));

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                aria-label={item.name}
                className={`
                  relative flex items-center justify-center rounded-full transition-all duration-300 shrink-0
                  ${
                    isActive
                      ? "w-[50px] h-[50px] bg-[#FC6B31] text-white shadow-inner scale-[1.02]" 
                      : "w-[40px] h-[40px] bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 mx-[5px] hover:scale-105 shadow-sm border border-gray-100 dark:border-none" 
                  }
                `}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className="w-[20px] h-[20px]"
                    strokeWidth={isActive ? 2.5 : 2.5}
                  />

                  {/* Cart badge */}
                  {item.badge && (
                    <span
                      className={`
                        absolute -top-2.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center border-2
                        ${
                          isActive 
                            ? "bg-white text-[#FC6B31] border-[#FC6B31]" 
                            : "bg-[#FC6B31] text-white border-white dark:border-[#27272A]"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}