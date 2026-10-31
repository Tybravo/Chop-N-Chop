"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { VendorProfile } from "@/types/vendor";
import { authService } from "@/services/vendor/auth.service";
import { vendorService } from "@/services/vendor/vendor.service";

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

  // No vendor profile is kept in localStorage. On mount, if a bearer token
  // exists, the authenticated vendor's profile is fetched straight from the
  // backend (GET /api/v1/vendors/me/profile) using that token.
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("vendor_access_token")
            : null;
        if (!token) {
          if (!cancelled) setIsLoading(false);
          return;
        }
        const profile = await vendorService.getProfile();
        if (!cancelled) setUser(profile);
      } catch (error) {
        // Token invalid/expired — the axios interceptor already clears it and
        // redirects to "/". Keep the user signed out in memory.
        console.warn("Vendor session hydration failed:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
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
        router.push("/");
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
    // Token only — the vendor profile itself is never persisted.
    localStorage.setItem("vendor_access_token", token);
    
    const vendorEmail = userData.email.replace(/[@.]/g, "_");
    router.push(`/vendor/${vendorEmail}/dashboard`);
  };

  const updateUser = (updates: Partial<VendorProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  // Keep vendor status (approval / suspension / store online) in sync with the
  // backend so the dashboard toggle and header reflect admin actions automatically.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const syncStatus = async () => {
      try {
        const status = await vendorService.getStatus();
        if (cancelled) return;

        setUser((current) => {
          if (!current) return current;

          const changed =
            current.vendorStatus !== status.vendorStatus ||
            current.kycStatus !== status.kycStatus ||
            current.kycCompleted !== status.kycCompleted ||
            current.isStoreOnline !== status.isStoreOnline;

          if (!changed) return current;
          return {
            ...current,
            vendorStatus: status.vendorStatus,
            kycStatus: status.kycStatus,
            kycCompleted: status.kycCompleted,
            isStoreOnline: status.isStoreOnline,
          };
        });
      } catch (error) {
        console.warn("Vendor status sync failed:", error);
      }
    };

    syncStatus();
    const intervalId = setInterval(syncStatus, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const logout = async () => {
    setUser(null);
    // Only the token is ever stored; the profile never lives in localStorage.
    localStorage.removeItem("vendor_access_token");
    router.push("/");

    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout error:", error);
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
