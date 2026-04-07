import { api } from '@/lib/axios';
import { Order, CreateOrderDto } from '@/types/order';

export const OrderService = {
  /**
   * Submit checkout order
   */
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  /**
   * Get user order history
   */
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  /**
   * Admin: Get all active orders
   */
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/admin/orders/active');
    return response.data;
  }
};
