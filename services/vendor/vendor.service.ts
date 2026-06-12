import { VendorProfile, VendorDashboardStats } from "@/types/vendor";
import { mockVendorProfile, mockVendorStats } from "@/lib/mock/vendor.mock";

export const vendorService = {
  getProfile: async (): Promise<VendorProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVendorProfile), 500);
    });
  },

  updateProfile: async (updates: Partial<VendorProfile>): Promise<VendorProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockVendorProfile, ...updates }), 500);
    });
  },

  getStats: async (): Promise<VendorDashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVendorStats), 500);
    });
  },

  toggleStoreStatus: async (isOpen: boolean): Promise<VendorProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockVendorProfile, isOpen }), 500);
    });
  }
};
