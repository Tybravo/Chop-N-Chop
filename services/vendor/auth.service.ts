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
}

export const authService = {
  login: async (payload: LoginPayload): Promise<{ success: boolean; token: string; user: VendorProfile }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/auth/login", payload);
      
      const token = response.data?.data?.access_token || response.data?.access_token;
      
      const userData: VendorProfile = {
        id: response.data?.data?.user_id || "mock_id",
        email: payload.email,
        businessName: "Vendor Business", // Needs to be fetched from profile if not in token, but we satisfy type here
        ownerName: "Vendor Owner",
        phone: "",
        status: response.data?.data?.status || "APPROVED",
        logoUrl: response.data?.data?.profilePictureUrl,
        isOpen: true,
        joinedAt: new Date().toISOString(),
      };

      return {
        success: true,
        token,
        user: userData,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || error.response.data?.error || "Invalid credentials");
      }
      throw new Error("An unexpected error occurred during login.");
    }
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; token: string; user: VendorProfile }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/verify", { email, otp });
      
      // Fallback to mock profile if the backend doesn't return the full user object yet
      const userData = response.data?.user || response.data?.vendor || {
        ...mockVendorProfile,
        email: email,
      };
      
      const token = response.data?.token || response.data?.accessToken || "mock_vendor_token";

      return {
        success: true,
        token: token,
        user: userData,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract the error message
        const backendMsg = error.response.data?.message || error.response.data?.error;
        
        // If it's a Spring Boot validation error array, extract it nicely
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          const validationMsg = error.response.data.errors
            .map((err: Record<string, string | undefined>) => `${err.field}: ${err.defaultMessage || err.message}`)
            .join(", ");
          throw new Error(validationMsg);
        }

        throw new Error(backendMsg || "Invalid OTP or expired");
      }
      throw new Error("An unexpected error occurred during OTP verification.");
    }
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/resend-otp", { email });
      return {
        success: true,
        message: response.data?.message || "OTP resent successfully",
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || error.response.data?.error || "Failed to resend OTP");
      }
      throw new Error("An unexpected error occurred while resending OTP.");
    }
  },

  register: async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const finalPayload = {
        ownerName: payload.ownerName,
        businessName: payload.businessName,
        email: payload.email,
        contactPhone: payload.contactPhone,
        pin: payload.pin,
        brand: "CHOP_N_CHOP",
        kitchenLocation: payload.kitchenLocation,
        businessCategory: payload.businessCategory && payload.businessCategory.trim() !== "" 
          ? payload.businessCategory 
          : "Not Available",
        businessDescription: payload.businessDescription && payload.businessDescription.trim() !== "" 
          ? payload.businessDescription 
          : "Not Available",
      };

      const response = await vendorApiClient.post("/api/v1/vendors/apply", finalPayload);
      return { success: true, message: response.data.message || "Registration successful" };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || error.response.data?.error || "Registration failed");
      }
      throw new Error("An unexpected error occurred during registration.");
    }
  },

  logout: async (): Promise<{ success: boolean; message?: string; data?: string }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/auth/logout");
      return response.data;
    } catch (_error: unknown) {
      // Suppress console.error to avoid triggering the Next.js error overlay for known backend issues (e.g., Redis timeouts)
      console.warn("Backend logout failed silently due to server error.");
      return { success: false, message: "Backend logout failed" };
    }
  }

};
