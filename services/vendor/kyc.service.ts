import { KycRecord } from "@/types/vendor";
import { mockKycRecords } from "@/lib/mock/vendor.mock";

export const kycService = {
  getKycRecords: async (): Promise<KycRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockKycRecords), 500);
    });
  },

  uploadDocument: async (documentType: string, file: File): Promise<KycRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `kyc_${Date.now()}`,
          vendorId: "vendor_1",
          documentType,
          documentUrl: URL.createObjectURL(file), // Mock URL
          status: "PENDING",
          submittedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  }
};
