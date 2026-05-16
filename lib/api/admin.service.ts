import axios from "axios";
import { LoginPayload, OTPPayload, DashboardData, AdminUser, Customer, Vendor, Transaction, Order, DispatchRider, InviteAdminPayload, InviteAdminResponse, UserProfileResponse, UpdateProfilePayload } from "@/types/admin";
import { MOCK_ADMINS, MOCK_DASHBOARD_DATA, MOCK_CUSTOMERS, MOCK_VENDORS, MOCK_TRANSACTIONS } from "@/lib/mock/admin.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-App-Brand": "CHOP_N_CHOP", // Global header for Multitenancy
  },
});

// Automatically inject Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  // Only attempt to read localStorage if we are in the browser
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
        // Safely handle both AxiosHeaders object and plain objects
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Failed to read token from localStorage:", error);
    }
  }
  return config;
});

// "Silent Refresh" Interceptor
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response, // If request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Expired Token) and we haven't already retried...
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If token is explicitly revoked, force logout immediately
      if (error.response.data?.message?.includes("revoked")) {
        localStorage.clear();
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, put this request in a queue to wait
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
            } else {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("admin_refresh_token");

      try {
        // Call unified refresh endpoint
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/auth/refresh`,
          { token: refreshToken },
          { headers: { "X-App-Brand": "CHOP_N_CHOP", "Content-Type": "application/json" } }
        );

        // Save the brand new tokens
        localStorage.setItem("admin_access_token", data.access_token || data.accessToken);
        if (data.refresh_token || data.refreshToken) {
          localStorage.setItem("admin_refresh_token", data.refresh_token || data.refreshToken);
        }

        // Process any requests that were waiting
        processQueue(null, data.access_token || data.accessToken);

        // Retry the original request that failed
        if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set("Authorization", `Bearer ${data.access_token || data.accessToken}`);
        } else {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${data.access_token || data.accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // The refresh token is dead (90 days passed, or blacklisted)
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/admin/login"; // Kick them out to login screen
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  message: string;
  role: string;
  status: string;
}

export const adminService = {
  /**
   * Live backend login using Email and Password
   */
  async login(payload: LoginPayload): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/api/v1/admin/auth/login-init", {
        emailOrUsername: payload.emailOrUsername,
        password: payload.password,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Login failed. Please check your credentials.");
      }
      throw new Error("An unexpected error occurred during login.");
    }
  },

  /**
   * Live API call to resend OTP
   */
  async resendOtp(email: string): Promise<string> {
    try {
      const response = await apiClient.post("/api/v1/admin/auth/resend", { email });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to resend OTP (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while resending OTP.");
    }
  },

  /**
   * Live OTP verification API call.
   * Resolves if the OTP is correct and returns JWT tokens.
   */
  async verifyOtp(payload: OTPPayload): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>("/api/v1/admin/auth/login-verify", {
        email: payload.email,
        otp: payload.otp,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Invalid OTP code.");
      }
      throw new Error("An unexpected error occurred verifying OTP.");
    }
  },

  /**
   * Live API call to invite a new admin/staff member.
   * Required role: SUPER_ADMIN.
   */
  async inviteAdmin(payload: InviteAdminPayload): Promise<InviteAdminResponse> {
    try {
      const response = await apiClient.post<InviteAdminResponse>("/api/v1/admin/staff/invite", {
        email: payload.email,
        phone: payload.phone,
        assignedBrand: payload.assignedBrand,
        role: payload.role,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        // Check for specific backend messages, fallback to standard Spring Boot 'error' field, then status code
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status} ${error.response.statusText}. Please check backend logs or CORS/CSRF.`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred during invitation.");
    }
  },

  /**
   * Simulates fetching dashboard data.
   */
  async getDashboardData(): Promise<DashboardData> {
    await delay(800);
    return MOCK_DASHBOARD_DATA;
  },

  async getAdmins(role?: string): Promise<AdminUser[]> {
    try {
      // Attempt to fetch from live backend. Adjust endpoint if different.
      const url = role ? `/api/v1/admin/staff?role=${encodeURIComponent(role)}` : "/api/v1/admin/staff";
      const response = await apiClient.get(url);
      
      // The Swagger says it returns an array directly: [ { id, email, role... } ]
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Failed to fetch live admins. Status: ${error.response.status}`, error.response.data);
      } else {
        console.error("Failed to fetch live admins. Network error or CORS.", error);
      }
      return MOCK_ADMINS;
    }
  },

  /**
   * Live API call to remove an admin/staff member.
   */
  async removeAdmin(id: string): Promise<{ success: boolean; message: string; data?: string }> {
    try {
      // Attempt to delete from live backend.
      const response = await apiClient.delete(`/api/v1/admin/staff/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status}. Failed to remove admin.`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred during admin removal.");
    }
  },

  /**
   * Live API call to change the status of an admin/staff member.
   */
  async changeAdminStatus(id: string, status: string): Promise<{ success: boolean; message: string; data?: string }> {
    try {
      const response = await apiClient.patch(`/api/v1/admin/staff/${id}/status?status=${status}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status}. Failed to change admin status.`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while changing status.");
    }
  },

  /**
   * Live API call to get current user profile.
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>("/api/v1/user/profile");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to fetch profile (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while fetching profile.");
    }
  },

  /**
   * Live API call to update current user profile.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.put<UserProfileResponse>("/api/v1/user/profile", payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to update profile (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while updating profile.");
    }
  },

  /**
   * Live API call to upload a profile picture.
   */
  async uploadProfilePicture(file: File): Promise<{ url: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/api/v1/user/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to upload picture (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while uploading the picture.");
    }
  },

  /**
   * Live API call to logout the admin, invalidating the JWT token on the backend.
   */
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post("/api/v1/auth/logout");
      return response.data;
    } catch (error: unknown) {
      // Even if the backend fails, we usually want to clear local storage anyway.
      console.error("Backend logout failed:", error);
      return { success: false, message: "Backend logout failed" };
    }
  },

  async getCustomers(): Promise<Customer[]> {
    await delay(500);
    return MOCK_CUSTOMERS;
  },

  async getVendors(): Promise<Vendor[]> {
    await delay(500);
    return MOCK_VENDORS;
  },

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return MOCK_DASHBOARD_DATA.recentOrders;
  },

  async getRiders(): Promise<DispatchRider[]> {
    await delay(500);
    return MOCK_DASHBOARD_DATA.dispatchStatus;
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(500);
    return MOCK_TRANSACTIONS;
  }
};
