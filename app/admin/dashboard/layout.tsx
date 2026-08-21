"use client";

import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { AdminHeader } from "@/components/admin/header/AdminHeader";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAdminAuth();

  // No local router.replace here: the AdminAuthProvider owns the single
  // authoritative redirect for unauthenticated users on /admin/dashboard routes.
  // Having a second component run its own redirect raced against the provider's
  // and caused the login<->dashboard ping-pong.

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
