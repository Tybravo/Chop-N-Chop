import { MenuItem } from './menu';

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliverySlot: string; // e.g. "12:00 PM - 1:00 PM"
  status: 'pending' | 'confirmed' | 'cooking' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CreateOrderDto {
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  deliverySlot: string;
  deliveryAddress: string;
  phoneNumber: string;
}
