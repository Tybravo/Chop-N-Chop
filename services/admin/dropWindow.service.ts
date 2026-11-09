import { adminApiClient } from "@/lib/axios";
import {
  ConfigureDropWindowRequest,
  DropWindowResponse,
  DropWindowType,
} from "@/types/admin";
import { formatApiError } from "@/lib/format-error";

function isDropWindowLike(value: unknown): value is DropWindowResponse {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("id" in value ||
      "windowType" in value ||
      "date" in value ||
      "timeFrom" in value ||
      "timeTo" in value)
  );
}

/**
 * Filter drop-window rows out of a possibly-nested backend JSON response,
 * using the same defensive iterative scan as the hub service (no recursion,
 * so it can never overflow on deep/nested payloads).
 */
function extractDropWindowArray(node: unknown): DropWindowResponse[] {
  const stack: unknown[] = [node];
  const seen = new WeakSet<object>();

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      const rows = current.filter(isDropWindowLike);
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

export const dropWindowService = {
  /**
   * Configure a structural delivery window container via
   * POST /api/v1/admin/drops/window.
   */
  configureWindow: async (
    payload: ConfigureDropWindowRequest
  ): Promise<DropWindowResponse> => {
    try {
      const response = await adminApiClient.post("/api/v1/admin/drops/window", payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to configure drop window"));
    }
  },

  /**
   * List all configured drop windows. The backend GET endpoint is not
   * deployed yet — this is wired against a typed contract and the array
   * normalizer, ready for when it lands.
   */
  getDropWindows: async (): Promise<DropWindowResponse[]> => {
    try {
      const response = await adminApiClient.get("/api/v1/admin/drops/window");
      return extractDropWindowArray(response.data?.data ?? response.data);
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to fetch drop windows"));
    }
  },

  /**
   * Type guard helper so UI chips can mark up selected window types safely.
   */
  isWindowType: (value: unknown): value is DropWindowType =>
    ["BREAKFAST", "LUNCH", "DINNER", "ALL_DAY"].includes(String(value)),
};