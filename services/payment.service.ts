import { api } from '@/lib/axios';

export const PaymentService = {
  /**
   * Initialize payment (e.g. Paystack)
   */
  initialize: async (orderId: string): Promise<{ paymentUrl: string; reference: string }> => {
    const response = await api.post(`/payments/init/${orderId}`);
    return response.data;
  },

  /**
   * Verify payment status
   */
  verify: async (reference: string): Promise<{ success: boolean }> => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
};
