import { VendorProfile, VendorDashboardStats } from "@/types/vendor";
import { vendorApiClient } from "@/services/vendor/auth.service";

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

const toVendorProfile = (profile: Record<string, unknown>): VendorProfile => ({
  id: (profile.id || profile.user_id || "") as string,
  email: (profile.email || "") as string,
  businessName: (profile.businessName || profile.business_name || "Vendor Business") as string,
  ownerName: (profile.ownerName || profile.owner_name || "Vendor Owner") as string,
  phone: (profile.phone || profile.contactPhone || "") as string,
  businessAddress: (profile.businessAddress || profile.kitchenLocation || "") as string,
  businessCategory: (profile.businessCategory || profile.business_category || "") as string,
  businessDescription: (profile.businessDescription || profile.business_description || "") as string,
  logoUrl: (profile.profilePictureUrl || profile.logoUrl) as string | undefined,
  vendorStatus: (profile.vendorStatus || "PENDING") as VendorProfile["vendorStatus"],
  kycStatus: (profile.kycStatus || "NOT_SUBMITTED") as VendorProfile["kycStatus"],
  kycCompleted: (profile.kycCompleted ?? false) as boolean,
  isStoreOnline: (profile.isStoreOnline ?? false) as boolean,
  joinedAt: (profile.joinedAt || profile.created_at || new Date().toISOString()) as string,
});

export const vendorService = {
  getProfile: async (): Promise<VendorProfile> => {
    const response = await vendorApiClient.get("/api/v1/vendors/me/profile");
    const profile = response.data?.data || response.data;
    return toVendorProfile(profile);
  },

  updateProfile: async (updates: Partial<VendorProfile>): Promise<VendorProfile> => {
    const payload: Record<string, unknown> = {};
    if (updates.businessName) payload.businessName = updates.businessName;
    if (updates.ownerName) payload.ownerName = updates.ownerName;
    if (updates.businessDescription) payload.businessDescription = updates.businessDescription;
    if (updates.businessCategory) payload.businessCategory = updates.businessCategory;
    if (updates.businessAddress) payload.kitchenLocation = updates.businessAddress;

    const response = await vendorApiClient.patch("/api/v1/vendors/me/profile", payload);
    const profile = response.data?.data || response.data;
    return toVendorProfile(profile);
  },

  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await vendorApiClient.post("/api/v1/vendors/me/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { url: response.data?.url || response.data?.profilePictureUrl || response.data?.logoUrl };
  },

  getStats: async (): Promise<VendorDashboardStats> => {
    const response = await vendorApiClient.get("/api/v1/vendors/me/stats");
    return response.data?.data || response.data;
  },

  toggleStoreStatus: async (isStoreOnline: boolean): Promise<VendorProfile> => {
    const response = await vendorApiClient.patch("/api/v1/vendors/me/profile", { isStoreOnline });
    const profile = response.data?.data || response.data;
    return toVendorProfile(profile);
  },

  getManifest: async (date: string, hubId?: string): Promise<ManifestResponse> => {
    const params = new URLSearchParams({ date });
    if (hubId) params.append("hubId", hubId);
    const response = await vendorApiClient.get(`/api/v1/vendor/manifests?${params.toString()}`);
    return response.data?.data || response.data;
  }
};
