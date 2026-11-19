import { adminApiClient } from "@/lib/axios";
import { Hub, CreateHubPayload, UpdateHubPayload } from "@/types/admin";
import { formatApiError } from "@/lib/format-error";

function isHubLike(value: unknown): value is Hub {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("id" in value || "name" in value || "address" in value)
  );
}

/**
 * Filter hub rows out of a possibly-nested backend JSON response.
 * The hub list endpoint may return a plain array OR an object wrapper such as
 * { data: [...] }, { content: [...] }, { hubs: [...] }, etc. Uses an iterative
 * scan (never recursion) with a visited-set so it cannot overflow on deep data.
 */
function extractHubArray(node: unknown): Hub[] {
  const stack: unknown[] = [node];
  const seen = new WeakSet<object>();

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      const hubs = current.filter(isHubLike);
      if (hubs.length > 0 || current.length === 0) return hubs;
    }

    if (current && typeof current === "object") {
      if (seen.has(current)) continue;
      seen.add(current);
      for (const child of Object.values(current as Record<string, unknown>)) {
        stack.push(child);
      }
    }
  }

  return [];
}

export const hubService = {
  getHubs: async (): Promise<Hub[]> => {
    try {
      const response = await adminApiClient.get("/api/v1/admin/hubs");
      // Normalize wrapped/nested responses into a flat array of hubs.
      return extractHubArray(response.data?.data ?? response.data);
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to fetch hubs"));
    }
  },

  getHubById: async (hubId: string): Promise<Hub> => {
    try {
      const response = await adminApiClient.get(`/api/v1/admin/hubs/${hubId}`);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to fetch hub details"));
    }
  },

  createHub: async (payload: CreateHubPayload): Promise<Hub> => {
    try {
      const response = await adminApiClient.post("/api/v1/admin/hubs", payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to create hub"));
    }
  },

  updateHub: async (hubId: string, payload: UpdateHubPayload): Promise<Hub> => {
    try {
      const response = await adminApiClient.put(`/api/v1/admin/hubs/${hubId}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to update hub"));
    }
  },

  deleteHub: async (hubId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await adminApiClient.delete(`/api/v1/admin/hubs/${hubId}`);
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to delete hub"));
    }
  },

  changeHubStatus: async (hubId: string, status: "ACTIVE" | "INACTIVE"): Promise<unknown> => {
    try {
      const response = await adminApiClient.patch(`/api/v1/admin/hubs/${hubId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to change hub status"));
    }
  }
};