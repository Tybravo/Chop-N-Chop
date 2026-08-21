"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminUser } from "@/types/admin";
import { authService } from "@/services/admin/auth.service";

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
  // Guard used to suspend auto-redirects while a logout is in flight, so the
  // login<->dashboard redirect effects don't ping-pong and loop forever.
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    // Check localStorage once on mount.
    // The JWT access token is the source of truth for an active session.
    const storedUser = localStorage.getItem("adminUser");
    const hasToken = !!localStorage.getItem("admin_access_token");

    // Use setTimeout to defer setState to avoid "cascading renders" lint warning
    setTimeout(() => {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (hasToken) {
        // Token exists but user object is missing (e.g. after refresh).
        // Restore a minimal user so the session is recognized as authenticated.
        setUser({
          id: "",
          name: "Admin",
          email: "",
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        });
      }
      setIsLoading(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggingOutRef.current) {
      // Authentication requires BOTH the user object AND the access token.
      // Relying on a token alone can treat an expired/stale token as an active
      // session, which bounced login<->dashboard and looped during session timeout.
      const hasToken =
        typeof window !== "undefined" && !!localStorage.getItem("admin_access_token");
      const isAuthed = !!user && hasToken;

      const isProtected = pathname?.startsWith("/admin/dashboard");
      const isAuthFlow = pathname === "/admin/login" || pathname === "/admin/verify-otp";

      // This provider is the ONLY navigation authority for auth redirection
      // (the dashboard layout no longer redirects). The two branches below are
      // mutually exclusive based on isAuthed, so they cannot race against each
      // other as long as isAuthed is stable for the current session.
      if (!isAuthed && isProtected) {
        // No valid session => keep signed-out users away from the dashboard.
        router.replace("/admin/login");
      } else if (isAuthed && isAuthFlow) {
        // Valid session => never show the login/OTP page; keep them on the
        // dashboard since their JWT is still valid.
        router.replace("/admin/dashboard");
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
    // Suspend auto-redirects so the login<->dashboard effects don't race and loop.
    isLoggingOutRef.current = true;

    // Clear local state instantly for snappy UI response
    setUser(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");

    // Navigate directly to a non-guarded route; replace avoids stacking history.
    router.replace("/admin/login");

    try {
      // Call backend to invalidate JWT in the background
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Re-enable redirects after navigation has settled.
    isLoggingOutRef.current = false;
  };

  const isAuthenticated =
    !!user &&
    (typeof window !== "undefined" && !!localStorage.getItem("admin_access_token"));

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isLoading }}>
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
