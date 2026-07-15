"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChefHat,
  CheckCircle,
  CreditCard,
  FileCheck,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  PlusCircle,
  Settings,
  UserCircle,
  UtensilsCrossed,
  X
} from "lucide-react";
import { useVendorAuth } from "@/context/VendorAuthContext";

type MenuItem = { name: string; href: string; icon: React.ElementType };

export function VendorSidebar({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const params = useParams();
  const email = params.email as string;
  const { logout } = useVendorAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed((prev) => (window.innerWidth < 1024 ? false : prev));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCollapsed = collapsed;

  const MENU_ITEMS: MenuItem[] = [
    { name: "Dashboard", href: `/vendor/${email}/dashboard`, icon: LayoutDashboard },
    { name: "Prepare", href: `/vendor/${email}/prepare`, icon: ChefHat },
    { name: "Ready", href: `/vendor/${email}/ready`, icon: CheckCircle },
    { name: "View Orders", href: `/vendor/${email}/orders`, icon: ListOrdered },
    { name: "Add Meal", href: `/vendor/${email}/meals/add`, icon: PlusCircle },
    { name: "View Meals", href: `/vendor/${email}/meals`, icon: UtensilsCrossed },
    { name: "Update Profile", href: `/vendor/${email}/profile`, icon: UserCircle },
    { name: "Update KYC", href: `/vendor/${email}/kyc`, icon: FileCheck },
    { name: "Payout", href: `/vendor/${email}/payout`, icon: CreditCard }
  ];

  const BOTTOM_ITEMS: MenuItem[] = [
    { name: "Help & Support", href: `/vendor/${email}/support`, icon: HelpCircle },
    { name: "Settings", href: `/vendor/${email}/settings`, icon: Settings }
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onClose();
    logout();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#26292C] text-white transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"} h-[100dvh] pb-safe shrink-0 font-sans`}
      >
        <div
          className={`flex items-center h-16 px-4 bg-white border-b border-gray-200 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <span className="text-xl font-extrabold text-[#FC6B31] tracking-tight whitespace-nowrap">
              Vendor Portal
            </span>
          )}

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} className="lg:hidden text-gray-500 hover:text-[#FC6B31] p-2 z-50">
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-gray-500 hover:text-[#FC6B31] transition-colors p-1"
          >
            {isCollapsed ? (
              <ArrowRightToLine className="w-5 h-5" />
            ) : (
              <ArrowLeftToLine className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center px-6 py-3 transition-colors ${
                      isActive
                        ? "bg-[#FC6B31] text-white rounded-r-3xl mr-4"
                        : "text-gray-300 hover:bg-[#34393d]"
                    } ${isCollapsed ? "justify-center rounded-none mr-0" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isCollapsed ? "" : "mr-4"}`}
                    />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="py-4 space-y-1 shrink-0 mb-16 lg:mb-0 overflow-x-hidden border-t border-gray-700/50">
          <ul className="space-y-1">
            {BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isCollapsed ? "" : "mr-4"}`}
                    />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}

            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                title={isCollapsed ? "Logout" : undefined}
                className={`flex w-full items-center px-6 py-3 text-gray-300 hover:bg-[#34393d] transition-colors cursor-pointer ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <LogOut className={`w-5 h-5 shrink-0 ${isCollapsed ? "" : "mr-4"}`} />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Do you want to logout?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You will need to sign in again to access your store.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

