import { adminApiClient } from "@/lib/axios";
import { Zone, CreateZonePayload, UpdateZonePayload } from "@/types/admin";
import { formatApiError } from "@/lib/format-error";

export const zoneService = {
  getZones: async (): Promise<Zone[]> => {
    try {
      const response = await adminApiClient.get("/api/v1/admin/zones");
      // Fallback if data is wrapped
      return response.data?.data || response.data || [];
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to fetch zones"));
    }
  },

  getZoneById: async (zoneId: string): Promise<Zone> => {
    try {
      const response = await adminApiClient.get(`/api/v1/admin/zones/${zoneId}`);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to fetch zone details"));
    }
  },

  createZone: async (payload: CreateZonePayload): Promise<Zone> => {
    try {
      const response = await adminApiClient.post("/api/v1/admin/zones", payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to create zone"));
    }
  },

  updateZone: async (zoneId: string, payload: UpdateZonePayload): Promise<Zone> => {
    try {
      const response = await adminApiClient.put(`/api/v1/admin/zones/${zoneId}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to update zone"));
    }
  },

  deleteZone: async (zoneId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await adminApiClient.delete(`/api/v1/admin/zones/${zoneId}`);
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to delete zone"));
    }
  },

  changeZoneStatus: async (zoneId: string, status: "ACTIVE" | "INACTIVE"): Promise<unknown> => {
    try {
      const response = await adminApiClient.patch(`/api/v1/admin/zones/${zoneId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to change zone status"));
    }
  }
};