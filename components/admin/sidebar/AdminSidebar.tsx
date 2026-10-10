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
  ArrowLeftToLine,
  Users,
  Store,
  CreditCard,
  BarChart3,
  Bell,
  Shield,
  Activity,
  Layers
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SafeAvatar } from "@/components/SafeAvatar";

type MenuItem = { name: string; href: string; icon: React.ElementType; role?: "SUPER_ADMIN" };

const MENU_ITEMS: MenuItem[] = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "View Summary", href: "/admin/dashboard/summary", icon: Activity },
  { name: "Categories", href: "/admin/dashboard/categories", icon: Layers },
  { name: "Admins", href: "/admin/dashboard/admins", icon: Shield, role: "SUPER_ADMIN" },
  { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
  { name: "Batches", href: "/admin/batches", icon: SquareDashedBottom },
  { name: "Kitchen", href: "/admin/kitchen", icon: ChefHat },
  { name: "Customers", href: "/admin/dashboard/customers", icon: Users },
  { name: "Vendors", href: "/admin/dashboard/vendors", icon: Store },
  { name: "Riders", href: "/admin/dashboard/riders", icon: Truck },
  { name: "Transactions", href: "/admin/dashboard/transactions", icon: CreditCard },
  { name: "Delivery Status", href: "/admin/delivery", icon: Crosshair },
  { name: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { name: "Notifications", href: "/admin/dashboard/notifications", icon: Bell },
  { name: "Help and Support", href: "/admin/dashboard/support", icon: Headset },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAdminAuth();

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
    logout();
  };

  return (
    <aside
      className={`bg-[#26292C] text-white transition-all duration-300 flex flex-col relative z-30 ${
        collapsed ? "w-20" : "w-64"}
      h-full shrink-0 font-sans`}>
      <div className={`flex items-center h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && user ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <SafeAvatar
                src={user?.avatarUrl && user.avatarUrl.trim() !== "" ? user.avatarUrl : "/avatar-placeholder.svg"}
                alt={user?.name || "Admin"}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate whitespace-nowrap">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-300 truncate whitespace-nowrap">
                {user?.role || "ADMIN"}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-xl font-extrabold text-[#FC6B31] tracking-tight">
            A
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


      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1">
          {/* Collapse/expand toggle as the first menu item. It never routes -
              it only toggles the sidebar width. When expanded it shows the
              arrow icon plus the "Collapse" label; when collapsed, only the
              icon is shown. */}
          <li>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`flex w-full items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors cursor-pointer ${
                collapsed ? "justify-center" : ""
              }`}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ArrowRightToLine className="w-5 h-5 shrink-0" />
              ) : (
                <>
                  <ArrowLeftToLine className="w-5 h-5 shrink-0 mr-4" />
                  <span className="font-medium">Collapse</span>
                </>
              )}
            </button>
          </li>
          {MENU_ITEMS.filter((item) => !item.role || item.role === user?.role).map((item) => {
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
              className={`flex w-full items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors cursor-pointer ${
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
