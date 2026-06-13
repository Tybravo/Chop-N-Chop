"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminUser } from "@/types/admin";
import { adminService } from "@/lib/api/admin.service";

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (user: AdminUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AdminUser>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage once on mount
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      // Use setTimeout to defer setState to avoid "cascading renders" lint warning
      setTimeout(() => {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
      }, 0);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname.startsWith("/admin/dashboard")) {
        router.push("/");
      }
      // Optional: Redirect to dashboard if logged in and visiting login/otp
      if (user && (pathname === "/admin/login" || pathname === "/admin/verify-otp")) {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: AdminUser) => {
    setUser(userData);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    router.push("/admin/dashboard");
  };

  const updateUser = (updates: Partial<AdminUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("adminUser", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    // Clear local state instantly for snappy UI response
    setUser(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    router.push("/");

    try {
      // Call backend to invalidate JWT in the background
      await adminService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
