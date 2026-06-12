import { VendorOrder, OrderStatus } from "@/types/vendor";
import { mockOrders } from "@/lib/mock/vendor.mock";

export const orderService = {
  getOrders: async (status?: OrderStatus): Promise<VendorOrder[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (status) {
          resolve(mockOrders.filter(o => o.status === status));
        } else {
          resolve(mockOrders);
        }
      }, 500);
    });
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<VendorOrder> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
          resolve({ ...order, status });
        } else {
          reject(new Error("Order not found"));
        }
      }, 500);
    });
  }
};
