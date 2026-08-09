import { adminApiClient } from '@/lib/axios';
import { PendingVendorApplication } from '@/types/vendor';
import axios from 'axios';

export type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "UNVERIFIED" | "SUSPENDED";

/**
 * Normalize a vendor object from the "all vendors" endpoint
 * (which uses `id`) into the shared `PendingVendorApplication` shape
 * (which uses `vendorProfileId`).
 */
function normalizeAllVendor(v: Record<string, unknown>): PendingVendorApplication {
  return {
    vendorProfileId: (v.id as string) || (v.vendorProfileId as string) || "",
    businessName: (v.businessName as string) || "",
    email: (v.email as string) || "",
    contactPhone: (v.contactPhone as string) || "",
    hubId: v.hubId as string | undefined,
    cacRegistrationNumber: v.cacRegistrationNumber as string | undefined,
    brand: v.brand as string | undefined,
    status: (v.status as PendingVendorApplication["status"]) || "PENDING",
  };
}

/**
 * Normalize a vendor object from the "pending applications" endpoint
 * (which already uses `vendorProfileId`).
 */
function normalizePendingVendor(v: Record<string, unknown>): PendingVendorApplication {
  return {
    vendorProfileId: (v.vendorProfileId as string) || (v.id as string) || "",
    businessName: (v.businessName as string) || "",
    email: (v.email as string) || "",
    contactPhone: (v.contactPhone as string) || "",
    hubId: v.hubId as string | undefined,
    cacRegistrationNumber: v.cacRegistrationNumber as string | undefined,
    brand: v.brand as string | undefined,
    status: (v.status as PendingVendorApplication["status"]) || "PENDING",
  };
}

export const vendorService = {
  /**
   * Get all vendor applications with their statuses.
   * Fetches from GET /api/v1/admin/vendors (optionally filterable by ?status=).
   */
  async getAllVendors(): Promise<PendingVendorApplication[]> {
    try {
      const response = await adminApiClient.get('/api/v1/admin/vendors');
      const vendors = response.data?.data || response.data || [];
      return vendors.map((v: Record<string, unknown>) => normalizeAllVendor(v));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.warn('Error fetching vendors:', error.response?.data || error.message);
      } else {
        console.warn('Unexpected error fetching vendors:', error);
      }
      throw error;
    }
  },

  /**
   * Get vendor applications filtered by status.
   * Fetches from GET /api/v1/admin/vendors?status=X
   */
  async getVendorsByStatus(status: VendorStatus): Promise<PendingVendorApplication[]> {
    try {
      const response = await adminApiClient.get('/api/v1/admin/vendors', {
        params: { status },
      });
      const vendors = response.data?.data || response.data || [];
      return vendors.map((v: Record<string, unknown>) => normalizeAllVendor(v));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.warn(`Error fetching ${status} vendors:`, error.response?.data || error.message);
      } else {
        console.warn(`Unexpected error fetching ${status} vendors:`, error);
      }
      throw error;
    }
  },

  /**
   * Get all pending vendor applications awaiting review.
   * Fetches from GET /api/v1/admin/vendors/pending
   */
  async getPendingApplications(): Promise<PendingVendorApplication[]> {
    try {
      const response = await adminApiClient.get('/api/v1/admin/vendors/pending');
      const vendors = response.data?.data || response.data || [];
      return vendors.map((v: Record<string, unknown>) => normalizePendingVendor(v));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.warn('Error fetching pending vendors:', error.response?.data || error.message);
      } else {
        console.warn('Unexpected error fetching pending vendors:', error);
      }
      throw error;
    }
  },

  /**
   * Approve a pending vendor application
   * Changes status to APPROVED, enables login, and initializes wallet
   */
  async approveVendor(vendorProfileId: string): Promise<void> {
    try {
      await adminApiClient.post(`/api/v1/admin/vendors/${vendorProfileId}/approve`, {});
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error approving vendor ${vendorProfileId}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        console.error(`Unexpected error approving vendor ${vendorProfileId}:`, error);
      }
      throw error;
    }
  },

  /**
   * Suspend an active vendor
   * Forcefully changes the vendor status to SUSPENDED
   * PATCH /api/v1/admin/vendors/{vendorProfileId}/status
   */
  async suspendVendor(vendorProfileId: string): Promise<void> {
    try {
      await adminApiClient.patch(`/api/v1/admin/vendors/${vendorProfileId}/status`, {
        status: "SUSPENDED",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error suspending vendor ${vendorProfileId}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error suspending vendor ${vendorProfileId}:`, error);
      }
      throw error;
    }
  },

  /**
   * Reject a pending vendor application
   * Declines the application and keeps the user locked out
   */
  async rejectVendor(vendorProfileId: string): Promise<void> {
    try {
      await adminApiClient.post(`/api/v1/admin/vendors/${vendorProfileId}/reject`, {});
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error rejecting vendor ${vendorProfileId}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error rejecting vendor ${vendorProfileId}:`, error);
      }
      throw error;
    }
  },
};