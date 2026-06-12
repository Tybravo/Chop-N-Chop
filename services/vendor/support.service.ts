import { SupportTicket } from "@/types/vendor";
import { mockSupportTickets } from "@/lib/mock/vendor.mock";

export const supportService = {
  getTickets: async (): Promise<SupportTicket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSupportTickets), 500);
    });
  },

  createTicket: async (subject: string, message: string): Promise<SupportTicket> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `ticket_${Date.now()}`,
          vendorId: "vendor_1",
          subject,
          message,
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  }
};
