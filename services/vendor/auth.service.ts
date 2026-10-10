import { VendorProfile } from "@/types/vendor";
import { mockVendorProfile } from "@/lib/mock/vendor.mock";
import axios from "axios";
import { formatApiError } from "@/lib/format-error";

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
      const userId = response.data?.data?.user_id || response.data?.data?.id || "mock_id";
      
      // Store token immediately so subsequent API calls can use it
      if (token && typeof window !== "undefined") {
        localStorage.setItem("vendor_access_token", token);
      }

      // Fetch the full vendor profile after login using the /me endpoint
      let userData: VendorProfile;
      try {
        const profileResponse = await vendorApiClient.get(`/api/v1/vendors/me/profile`);
        const profile = profileResponse.data?.data || profileResponse.data;
        
        userData = {
          id: userId,
          email: payload.email,
          businessName: profile?.businessName || profile?.business_name || "Vendor Business",
          ownerName: profile?.ownerName || profile?.owner_name || "Vendor Owner",
          phone: profile?.phone || profile?.contactPhone || "",
          businessAddress: profile?.businessAddress || profile?.kitchenLocation || "",
          businessCategory: profile?.businessCategory || profile?.business_category || "",
          businessDescription: profile?.businessDescription || profile?.business_description || "",
          logoUrl: profile?.profilePictureUrl || profile?.logoUrl || response.data?.data?.profilePictureUrl || response.data?.data?.logoUrl || response.data?.profilePictureUrl,
          vendorStatus: profile?.vendorStatus || "PENDING",
          kycStatus: profile?.kycStatus || "NOT_SUBMITTED",
          kycCompleted: profile?.kycCompleted ?? false,
          isStoreOnline: profile?.isStoreOnline ?? false,
          joinedAt: profile?.joinedAt || profile?.created_at || new Date().toISOString(),
        };
      } catch (profileError) {
        // Fallback to login response data if profile fetch fails
        console.warn("Failed to fetch vendor profile, using login response:", profileError);
        userData = {
          id: userId,
          email: payload.email,
          businessName: response.data?.data?.businessName || response.data?.businessName || "Vendor Business",
          ownerName: response.data?.data?.ownerName || response.data?.ownerName || "Vendor Owner",
          phone: response.data?.data?.phone || response.data?.data?.contactPhone || "",
          businessAddress: "",
          businessCategory: "",
          businessDescription: "",
          logoUrl: response.data?.data?.profilePictureUrl || response.data?.data?.logoUrl || response.data?.profilePictureUrl,
          vendorStatus: "PENDING",
          kycStatus: "NOT_SUBMITTED",
          kycCompleted: false,
          isStoreOnline: false,
          joinedAt: new Date().toISOString(),
        };
      }

      return {
        success: true,
        token,
        user: userData,
      };
    } catch (error: unknown) {
      throw new Error(formatApiError(error, "Invalid credentials"));
    }
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; token: string; user: VendorProfile }> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendors/verify", { email, otp });
      
      // Fallback to mock profile if the backend doesn't return the full user object yet
      const userData = response.data?.user || response.data?.vendor || {
        ...mockVendorProfile,
        email: email,
      } as VendorProfile;
      
      const token = response.data?.token || response.data?.accessToken || "mock_vendor_token";

      return {
        success: true,
        token: token,
        user: userData,
      };
    } catch (error: unknown) {
      throw new Error(formatApiError(error, "Invalid OTP or expired"));
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
      throw new Error(formatApiError(error, "Failed to resend OTP"));
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
      return { success: true, message: response.data?.message || "Registration successful" };
    } catch (error: unknown) {
      throw new Error(formatApiError(error, "Registration failed"));
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
