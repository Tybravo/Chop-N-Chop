"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, User } from "lucide-react";

export default function FloatingBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Cart", href: "/cart", icon: ShoppingBag },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="bg-white dark:bg-zinc-900 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-sm pointer-events-auto border border-gray-100 dark:border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="relative flex flex-col items-center p-2 group"
            >
              <Icon 
                className={`w-6 h-6 transition-colors duration-200 ${
                  isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}