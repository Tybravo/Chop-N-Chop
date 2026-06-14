import { adminApiClient } from "@/lib/axios";
import { AdminUser, InviteAdminPayload, InviteAdminResponse } from "@/types/admin";
import { MOCK_ADMINS } from "@/lib/mock/admin.mock";
import axios from "axios";

export const staffService = {
  async inviteAdmin(payload: InviteAdminPayload): Promise<InviteAdminResponse> {
    try {
      const response = await adminApiClient.post<InviteAdminResponse>("/api/v1/admin/staff/invite", {
        email: payload.email,
        phone: payload.phone,
        assignedBrand: payload.assignedBrand,
        role: payload.role,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status} ${error.response.statusText}. Please check backend logs or CORS/CSRF.`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred during invitation.");
    }
  },

  async getAdmins(role?: string): Promise<AdminUser[]> {
    try {
      const url = role ? `/api/v1/admin/staff?role=${encodeURIComponent(role)}` : "/api/v1/admin/staff";
      const response = await adminApiClient.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Failed to fetch live admins. Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
          throw error;
        }
      } else {
        console.error("Failed to fetch live admins. Network error or CORS.", error);
      }
      return MOCK_ADMINS;
    }
  },

  async removeAdmin(id: string): Promise<{ success: boolean; message: string; data?: string }> {
    try {
      const response = await adminApiClient.delete(`/api/v1/admin/staff/${id}`);
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

  async changeAdminStatus(id: string, status: string): Promise<{ success: boolean; message: string; data?: string }> {
    try {
      const response = await adminApiClient.patch(`/api/v1/admin/staff/${id}/status?status=${status}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Server responded with ${error.response.status}. Failed to change admin status.`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while changing status.");
    }
  }
};