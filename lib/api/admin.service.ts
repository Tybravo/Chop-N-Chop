import axios from "axios";
import { LoginPayload, OTPPayload, DashboardData, AdminUser, Customer, Vendor, Transaction, Order, DispatchRider, InviteAdminPayload, InviteAdminResponse } from "@/types/admin";
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
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      // Safely handle both AxiosHeaders object and plain objects
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      console.warn("No admin_access_token found in localStorage!");
    }
  }
  return config;
});

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
        console.error("Invite Admin 403/Error Response:", error.response.data);
        const errorData = error.response.data;
        // Check for specific backend messages, fallback to standard Spring Boot 'error' field, then status code
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status} ${error.response.statusText}. Please check backend logs or CORS/CSRF.`;
        throw new Error(errorMsg);
      }
      console.error("Invite Admin Unexpected Error:", error);
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

  async getAdmins(): Promise<AdminUser[]> {
    try {
      // Attempt to fetch from live backend. Adjust endpoint if different.
      const response = await apiClient.get("/api/v1/admin/staff");
      // Depending on your backend structure, it might be response.data or response.data.data
      return response.data.data || response.data;
    } catch (error) {
      console.warn("Failed to fetch live admins (endpoint might not exist yet). Falling back to mock data.", error);
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
