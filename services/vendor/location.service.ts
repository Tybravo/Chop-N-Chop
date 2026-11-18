import {
  VendorHub,
  VendorZone,
  VendorLocationPayload,
  VendorCurrentLocation,
  ResolvedZone,
} from "@/types/vendor";
import { vendorApiClient } from "@/services/vendor/auth.service";
import { formatApiError } from "@/lib/format-error";

/**
 * Iterative scan that extracts an array of records matching `predicate` from a
 * possibly nested/wrapped backend JSON response (data -> data -> [] ...),
 * without recursion, so deep or repeated payloads can never overflow.
 */
function extractArray<T>(
  node: unknown,
  predicate: (value: unknown) => value is T
): T[] {
  const stack: unknown[] = [node];
  const seen = new WeakSet<object>();

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      const rows = current.filter(predicate);
      if (rows.length > 0 || current.length === 0) return rows;
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

const isHubLike = (v: unknown): v is VendorHub =>
  !!v && typeof v === "object" && !Array.isArray(v) && "id" in v && "name" in v;

const isZoneLike = (v: unknown): v is VendorZone =>
  !!v && typeof v === "object" && !Array.isArray(v) && "id" in v && "name" in v;

/**
 * Read the vendor's currently-assigned hub/zone out of the profile payload.
 * The profile detail nests onboarding + store info; the exact location of
 * these fields varies by backend build, so we scan the whole object for the
 * first hubId/zoneId and their names, and fall back to undefined.
 */
function extractCurrentLocation(node: unknown): VendorCurrentLocation {
  const result: VendorCurrentLocation = {};

  if (!node || typeof node !== "object") return result;

  const walk = (value: unknown): void => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const obj = value as Record<string, unknown>;

    // Capture hub/zone ids + names on the first object that has them.
    if (result.hubId === undefined && typeof obj.hubId === "string") {
      result.hubId = obj.hubId;
      if (typeof obj.hubName === "string") result.hubName = obj.hubName;
      else if (typeof obj.name === "string" && "code" in obj) result.hubName = obj.name as string;
    }
    if (result.zoneId === undefined && typeof obj.zoneId === "string") {
      result.zoneId = obj.zoneId;
      if (typeof obj.zoneName === "string") result.zoneName = obj.zoneName;
      else if (typeof obj.name === "string" && "hubId" in obj) result.zoneName = obj.name as string;
    }

    for (const child of Object.values(obj)) {
      if (child && typeof child === "object") walk(child);
    }
  };

  walk(node);
  return result;
}

export const vendorLocationService = {
  /**
   * GET /api/v1/vendors/hubs
   * Fetch all active/available hubs for the vendor to choose from.
   *
   * The vendor-specific endpoint may not be deployed to the API yet —
   * when it is missing we fall back to the live public discovery endpoint
   * GET /api/v1/hubs/active (same HubResponse shape).
   */
  getHubs: async (): Promise<VendorHub[]> => {
    try {
      const response = await vendorApiClient.get("/api/v1/vendors/hubs");
      return extractArray(response.data?.data ?? response.data, isHubLike);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      try {
        // Vendor endpoint missing (dedicated deployment pending) -> public fallback.
        const fallback = await vendorApiClient.get("/api/v1/hubs/active");
        return extractArray(fallback.data?.data ?? fallback.data, isHubLike);
      } catch (fallbackError) {
        // Preserve the primary error when it was a real failure (e.g. 401/403).
        if (status && status !== 404) {
          throw new Error(formatApiError(error, "Failed to fetch available hubs"));
        }
        throw new Error(formatApiError(fallbackError, "Failed to fetch available hubs"));
      }
    }
  },

  /**
   * GET /api/v1/vendors/hubs/{hubId}/zones
   * Fetch active zones belonging to the selected hub.
   *
   * Falls back to the live public endpoint GET /api/v1/zones/hub/{hubId}
   * (same ZoneResponse shape) while the vendor endpoint is not deployed.
   */
  getZones: async (hubId: string): Promise<VendorZone[]> => {
    try {
      const response = await vendorApiClient.get(`/api/v1/vendors/hubs/${hubId}/zones`);
      return extractArray(response.data?.data ?? response.data, isZoneLike);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      try {
        const fallback = await vendorApiClient.get(`/api/v1/zones/hub/${hubId}`);
        return extractArray(fallback.data?.data ?? fallback.data, isZoneLike);
      } catch (fallbackError) {
        if (status && status !== 404) {
          throw new Error(formatApiError(error, "Failed to fetch zones for this hub"));
        }
        throw new Error(formatApiError(fallbackError, "Failed to fetch zones for this hub"));
      }
    }
  },

  /**
   * PATCH /api/v1/vendors/me/hubs/{hubId}/zones
   * Update the vendor's profile Hub/Zone assignment.
   */
  updateLocation: async (
    hubId: string,
    zoneId: string
  ): Promise<{ message: string }> => {
    try {
      const response = await vendorApiClient.patch(
        `/api/v1/vendors/me/hubs/${hubId}/zones`,
        { hubId, zoneId } satisfies VendorLocationPayload
      );
      return {
        message: (response.data?.message as string) || "Location updated successfully",
      };
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to update location"));
    }
  },

  /**
   * GET /api/v1/vendors/me/profile
   * Read the current hub the vendor previously selected (if any).
   *
   * The profile response nests the onboarding data under `data.onboarding`,
   * and the vendor's assigned hub is exposed there as `hubId`. The profile
   * GET may also be wrapped, so we scan defensively for the first hubId.
   */
  getMyLocation: async (): Promise<VendorCurrentLocation> => {
    try {
      const response = await vendorApiClient.get("/api/v1/vendors/me/profile");
      const payload = response.data?.data ?? response.data;
      return extractCurrentLocation(payload);
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to load your current location"));
    }
  },

  /**
   * POST /api/v1/zones/resolve
   * Resolve GPS coordinates to the active delivery zone for the vendor.
   */
  resolveZone: async (
    latitude: number,
    longitude: number
  ): Promise<ResolvedZone> => {
    try {
      const response = await vendorApiClient.post("/api/v1/zones/resolve", {
        latitude,
        longitude,
      });
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Could not detect your location zone"));
    }
  },
};