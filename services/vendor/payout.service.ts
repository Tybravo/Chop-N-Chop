import { PayoutRecord } from "@/types/vendor";
import { mockPayouts } from "@/lib/mock/vendor.mock";

export const payoutService = {
  getPayouts: async (): Promise<PayoutRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPayouts), 500);
    });
  },

  requestPayout: async (amount: number): Promise<PayoutRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `pay_${Date.now()}`,
          vendorId: "vendor_1",
          amount,
          status: "PENDING",
          date: new Date().toISOString(),
          reference: `REF-${Date.now()}`,
        });
      }, 500);
    });
  }
};
