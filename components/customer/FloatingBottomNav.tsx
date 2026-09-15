"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, User } from "lucide-react";

export default function FloatingBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/customer", icon: Home },
    { label: "Explore", href: "/customer/explore", icon: Compass },
    { label: "Cart", href: "/customer/cart", icon: ShoppingBag },
    { label: "Profile", href: "/customer/profile", icon: User },
  ];

  return (
    // The original floating container
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="bg-white dark:bg-zinc-900 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rounded-full p-2 flex items-center justify-between w-full max-w-sm pointer-events-auto border border-gray-100 dark:border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== "/customer" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.label}
              href={tab.href}
              // The expanding active state
              className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-orange-400 text-white px-4 py-2 rounded-full gap-2 shadow-sm shadow-orange-400/20"
                  : "text-gray-400 p-2 hover:text-gray-500"
              }`}
            >
              <Icon 
                className={`${isActive ? "w-5 h-5" : "w-6 h-6"}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {isActive && (
                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                  {tab.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}