import { adminApiClient } from "@/lib/axios";
import { Zone, CreateZonePayload, UpdateZonePayload } from "@/types/admin";
import { formatApiError } from "@/lib/format-error";

/**
 * Keys emitted by the backend's JTS geometry serialization. They are deeply
 * nested (envelope/factory/centroid/interiorPoint/...), never contain the zone
 * list itself, and must be skipped to keep the scan fast and overflow-proof.
 */
const GEOMETRY_KEYS = new Set([
  "boundary",
  "boundaryWkt",
  "envelope",
  "envelopeInternal",
  "factory",
  "precisionModel",
  "coordinateSequenceFactory",
  "coordinateSequence",
  "coordinates",
  "centroid",
  "interiorPoint",
  "exteriorRing",
  "userData",
]);

function isZoneLike(value: unknown): value is Zone {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("id" in value || "name" in value || "code" in value)
  );
}

/**
 * Filter zone rows out of a possibly-nested backend JSON response.
 * The zone list endpoint may return a plain array OR an object wrapper such as
 * { data: [...] }, { content: [...] }, { zones: [...] }, etc. Uses an
 * iterative scan (never recursion) with a visited-set, so it cannot overflow
 * even on deep/cyclic geometry data.
 */
function extractZoneArray(node: unknown): Zone[] {
  const stack: unknown[] = [node];
  const seen = new WeakSet<object>();

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      return current.filter(isZoneLike);
    }

    if (current && typeof current === "object") {
      if (seen.has(current)) continue;
      seen.add(current);
      for (const [key, child] of Object.entries(current as Record<string, unknown>)) {
        if (GEOMETRY_KEYS.has(key)) continue;
        stack.push(child);
      }
    }
  }

  return [];
}

export const zoneService = {
  getZones: async (): Promise<Zone[]> => {
    try {
      const response = await adminApiClient.get("/api/v1/admin/zones");
      // Normalize wrapped/nested responses into a flat array of zones.
      return extractZoneArray(response.data?.data ?? response.data);
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
