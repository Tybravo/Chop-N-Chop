import { api } from '@/lib/axios';
import { MenuItem } from '@/types/menu';

export const MenuService = {
  /**
   * Fetch today's menu batch
   */
  getDailyMenu: async (): Promise<MenuItem[]> => {
    const response = await api.get('/menu/daily');
    return response.data;
  },

  /**
   * Check stock for specific items
   */
  checkStock: async (itemIds: string[]): Promise<Record<string, number>> => {
    const response = await api.post('/menu/stock', { itemIds });
    return response.data;
  }
};
