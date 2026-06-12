"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { VendorProfile } from "@/types/vendor";
import { authService } from "@/services/vendor/auth.service";

interface VendorAuthContextType {
  user: VendorProfile | null;
  login: (user: VendorProfile, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<VendorProfile>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("vendorUser");
    if (storedUser) {
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
      const isAuthRoute = pathname.startsWith("/vendor/login") || 
                          pathname.startsWith("/vendor/register") || 
                          pathname.startsWith("/vendor/verify-otp");
      
      const isDashboardRoute = pathname.includes("/dashboard") || 
                               pathname.includes("/prepare") || 
                               pathname.includes("/ready");

      if (!user && isDashboardRoute) {
        router.push("/vendor/login");
      }

      if (user && isAuthRoute) {
        // Redirect to their specific vendor dashboard using their email
        // Or if the URL already has a vendor email, use it.
        const vendorEmail = user.email.replace(/[@.]/g, "_"); // Simple slugification for demo
        router.push(`/vendor/${vendorEmail}/dashboard`);
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: VendorProfile, token: string) => {
    setUser(userData);
    localStorage.setItem("vendorUser", JSON.stringify(userData));
    localStorage.setItem("vendor_access_token", token);
    
    const vendorEmail = userData.email.replace(/[@.]/g, "_");
    router.push(`/vendor/${vendorEmail}/dashboard`);
  };

  const updateUser = (updates: Partial<VendorProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("vendorUser", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("vendorUser");
    localStorage.removeItem("vendor_access_token");
    router.push("/vendor/login");

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <VendorAuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error("useVendorAuth must be used within a VendorAuthProvider");
  }
  return context;
}
