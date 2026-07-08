import { VendorProfile } from "@/types/vendor";
import { mockVendorProfile } from "@/lib/mock/vendor.mock";
import axios from "axios";

// 1. Create a dedicated Axios instance for Vendor requests
export const vendorApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-App-Brand": "CHOP_N_CHOP",
  },
});

// 2. Automatically inject the Vendor Authorization header
vendorApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("vendor_access_token");
      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Failed to read vendor token:", error);
    }
  }
  return config;
});

// 3. Handle 401 Unauthorized / Token Expiration globally for Vendors
vendorApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vendorUser");
        localStorage.removeItem("vendor_access_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

interface LoginPayload {
  email: string;
  pin?: string;
}

interface RegisterPayload {
  ownerName?: string;
  businessName: string;
  email: string;
  contactPhone: string;
  pin?: string;
  brand?: string;
  hubId?: string;
  kitchenLocation?: string;
  businessCategory?: string;
  businessDescription?: string;
  cacRegistrationNumber?: string;
}

export const authService = {
  login: async (_payload: LoginPayload): Promise<{ success: boolean; message: string }> => {
    // TODO: Replace with live backend endpoint: await vendorApiClient.post("/api/v1/vendors/auth/login-init", _payload)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "OTP sent successfully" });
      }, 500);
    });
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; token: string; user: VendorProfile }> => {
    // TODO: Replace with live backend endpoint: await vendorApiClient.post("/api/v1/vendors/auth/login-verify", { email, otp })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve({ success: true, token: "mock_vendor_token", user: mockVendorProfile });
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 500);
    });
  },

  register: async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/apply", {
        ...payload,
        brand: "CHOP_N_CHOP",
        hubId: payload.hubId || "",
        cacRegistrationNumber: payload.cacRegistrationNumber || ""
      });
      return { success: true, message: response.data.message || "Registration successful" };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || error.response.data?.error || "Registration failed");
      }
      throw new Error("An unexpected error occurred during registration.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await vendorApiClient.post("/api/v1/vendors/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    }
  }
};
