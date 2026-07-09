"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ListOrdered, UtensilsCrossed, CreditCard, UserCircle } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const email = params.email as string;

  const NAV_ITEMS = [
    { name: "Dashboard", href: `/vendor/${email}/dashboard`, icon: LayoutDashboard },
    { name: "Orders", href: `/vendor/${email}/orders`, icon: ListOrdered },
    { name: "Meals", href: `/vendor/${email}/meals`, icon: UtensilsCrossed },
    { name: "Payout", href: `/vendor/${email}/payout`, icon: CreditCard },
    { name: "Profile", href: `/vendor/${email}/profile`, icon: UserCircle },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-[#FC6B31]" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
