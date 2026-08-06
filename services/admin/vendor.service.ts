import { adminApiClient } from '@/lib/axios';
import { PendingVendorApplication } from '@/types/vendor';
import axios from 'axios';

export const vendorService = {
  /**
   * Get all pending vendor applications awaiting review
   */
  async getPendingApplications(): Promise<PendingVendorApplication[]> {
    try {
      const response = await adminApiClient.get('/api/v1/admin/vendors/pending');
      return response.data?.data || response.data || [];
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
   * Temporarily locks them out of their account
   */
  async suspendVendor(vendorProfileId: string): Promise<void> {
    try {
      await adminApiClient.post(`/api/v1/admin/vendors/${vendorProfileId}/suspend`, {});
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
