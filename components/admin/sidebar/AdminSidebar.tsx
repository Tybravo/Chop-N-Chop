"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  ShoppingCart,
  ChefHat,
  Truck,
  Settings,
  LogOut,
  Headset,
  SquareDashedBottom,
  Crosshair,
  ArrowRightToLine,
  ArrowLeftToLine
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MENU_ITEMS = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "Order", href: "/admin/orders", icon: ShoppingCart },
  { name: "Batches", href: "/admin/batches", icon: SquareDashedBottom },
  { name: "Kitchen", href: "/admin/kitchen", icon: ChefHat },
  { name: "Riders", href: "/admin/riders", icon: Truck },
  { name: "Delivery Status", href: "/admin/delivery", icon: Crosshair },
];

const BOTTOM_ITEMS = [
  { name: "Help and Support", href: "/admin/help", icon: Headset },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <aside
      className={`bg-[#26292C] text-white transition-all duration-300 flex flex-col relative z-30 ${
        collapsed ? "w-20" : "w-64"
      } h-screen shrink-0 font-sans`}
    >
      {/* Header */}
      <div className={`flex items-center h-16 px-4 bg-white ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <span className="text-xl font-extrabold text-[#FC6B31] tracking-tight">
            Chop n&apos; Chop
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-[#FC6B31] transition-colors p-1"
        >
          {collapsed ? (
            <ArrowRightToLine className="w-5 h-5" />
          ) : (
            <ArrowLeftToLine className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 transition-colors ${
                    isActive
                      ? "bg-[#FC6B31] text-white rounded-r-3xl mr-4"
                      : "text-gray-300 hover:bg-[#34393d]"
                  } ${collapsed ? "justify-center rounded-none mr-0" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      collapsed ? "" : "mr-4"
                    }`}
                  />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Navigation */}
      <div className="py-4 space-y-1">
        <ul className="space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors ${
                    collapsed ? "justify-center" : ""
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      collapsed ? "" : "mr-4"
                    }`}
                  />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleLogout}
              className={`flex w-full items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut
                className={`w-5 h-5 shrink-0 ${
                  collapsed ? "" : "mr-4"
                }`}
              />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
