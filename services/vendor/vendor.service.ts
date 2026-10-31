import { VendorProfile, VendorDashboardStats, VendorStatusData } from "@/types/vendor";
import { vendorApiClient } from "@/services/vendor/auth.service";

const formatBackendError = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const err = error as {
      response?: {
        status?: number;
        data?: { message?: string; error?: string };
      };
    };
    const data = err.response?.data;
    const msg = data?.message || data?.error;
    if (msg) return msg;
    const status = err.response?.status;
    if (status) return `${fallback} (HTTP ${status})`;
  }
  return fallback;
};

export interface ManifestItem {
  itemId: string;
  itemName: string;
  totalQuantityNeeded: number;
  unitPrice: number;
  expectedRevenue: number;
}

export interface ManifestResponse {
  vendorId: string;
  catalogDate: string;
  hubId?: string;
  totalDishesToPrepare: number;
  items: ManifestItem[];
}

// Maps the nested payload returned by
// GET /api/v1/vendors/me/profile into the frontend VendorProfile.
// phone (account.phone) is the immutable account identity and is kept
// separate from contactPhone (onboarding.contactPhone) which is editable.
const toVendorProfileFromDetail = (
  detail: Record<string, unknown>
): VendorProfile => {
  const account = (detail?.account || {}) as Record<string, unknown>;
  const onboarding = (detail?.onboarding || {}) as Record<string, unknown>;
  const store = (detail?.store || {}) as Record<string, unknown>;
  const kyc = (detail?.kyc || {}) as Record<string, unknown>;

  return {
    id: (detail?.vendorId || "") as string,
    email: (account?.email || "") as string,
    businessName: (onboarding?.businessName || "Vendor Business") as string,
    ownerName: (onboarding?.ownerName || "Vendor Owner") as string,
    // Immutable account identity — never sourced from onboarding.
    phone: (account?.phone || "") as string,
    // Editable vendor contact phone. If the backend has not yet stored a
    // distinct contactPhone, it legitimately renders as the account phone —
    // the two are only ever equal when no separate contactPhone exists yet.
    contactPhone: (onboarding?.contactPhone || account?.phone || "") as string,
    businessAddress: (onboarding?.kitchenLocation || "") as string,
    businessCategory: (onboarding?.businessCategory || "") as string,
    businessDescription: (onboarding?.businessDescription || "") as string,
    logoUrl: (onboarding?.profilePictureUrl || "") as string,
    vendorStatus: (store?.status || "PENDING") as VendorProfile["vendorStatus"],
    kycStatus: ("NOT_SUBMITTED") as VendorProfile["kycStatus"],
    kycCompleted: (kyc?.kycCompleted ?? false) as boolean,
    isStoreOnline: (store?.storeOnline ?? false) as boolean,
    joinedAt: (account?.createdAt || new Date().toISOString()) as string,
  };
};

export const vendorService = {
  getProfile: async (): Promise<VendorProfile> => {
    // GET /api/v1/vendors/me/profile — the backend authenticates the caller
    // from the Bearer token and returns the authenticated vendor's own
    // profile. No client-supplied id is needed or passed, so there is no risk
    // of an id mismatch (which previously caused HTTP 500).
    let response;
    try {
      response = await vendorApiClient.get("/api/v1/vendors/me/profile");
    } catch (error) {
      // Surface the real backend error (401, 403, 404, 500, ...) instead of a
      // generic message so backend integration issues are visible during testing.
      throw new Error(
        formatBackendError(error, "Failed to load profile from the server.")
      );
    }

    const detail = ((response.data?.data || response.data) as Record<string, unknown>) || {};
    if (!detail.onboarding) {
      throw new Error("Unexpected profile response from the server.");
    }
    return toVendorProfileFromDetail(detail);
  },

  updateProfile: async (updates: Partial<VendorProfile>): Promise<{ message: string }> => {
    // Only fields accepted by PATCH /api/v1/vendors/me/profile are sent.
    // contactPhone is now part of the backend schema
    // (UpdateVendorProfileRequest), so an edited Contact Phone persists.
    const payload: Record<string, unknown> = {};
    if (updates.ownerName !== undefined) payload.ownerName = updates.ownerName;
    if (updates.businessName !== undefined) payload.businessName = updates.businessName;
    if (updates.businessDescription !== undefined) payload.businessDescription = updates.businessDescription;
    if (updates.businessCategory !== undefined) payload.businessCategory = updates.businessCategory;
    if (updates.businessAddress !== undefined) payload.kitchenLocation = updates.businessAddress;
    if (updates.contactPhone !== undefined) payload.contactPhone = updates.contactPhone;
    // account.phone stays immutable.

    let response;
    try {
      response = await vendorApiClient.patch("/api/v1/vendors/me/profile", payload);
    } catch (error) {
      throw new Error(
        formatBackendError(error, "Failed to update profile.")
      );
    }
    const message = (response.data?.message as string) || "Profile updated successfully";
    return { message };
  },

  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await vendorApiClient.post("/api/v1/vendors/me/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const url =
      response.data?.url ||
      response.data?.profilePictureUrl ||
      response.data?.logoUrl ||
      response.data?.data?.url ||
      response.data?.data?.profilePictureUrl ||
      response.data?.data?.onboarding?.profilePictureUrl;
    if (!url) {
      throw new Error("Upload succeeded but no image URL was returned.");
    }
    return { url };
  },

  getStatus: async (): Promise<VendorStatusData> => {
    const response = await vendorApiClient.get("/api/v1/vendors/me/status");
    const data = response.data?.data || response.data;
    return {
      vendorStatus: (data?.vendorStatus || "PENDING") as VendorStatusData["vendorStatus"],
      kycStatus: (data?.kycStatus || "NOT_SUBMITTED") as VendorStatusData["kycStatus"],
      kycCompleted: data?.kycCompleted ?? false,
      isStoreOnline: data?.isStoreOnline ?? false,
    };
  },

  getStats: async (): Promise<VendorDashboardStats> => {
    const response = await vendorApiClient.get("/api/v1/vendors/me/stats");
    return response.data?.data || response.data;
  },

  getManifest: async (date: string, hubId?: string): Promise<ManifestResponse> => {
    const params = new URLSearchParams({ date });
    if (hubId) params.append("hubId", hubId);
    const response = await vendorApiClient.get(`/api/v1/vendor/manifests?${params.toString()}`);
    return response.data?.data || response.data;
  }
};