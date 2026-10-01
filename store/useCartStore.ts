import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem } from '@/types/menu';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface SimpleCartItem {
  id: string | number;
  name: string;
  desc: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  addToCart: (item: SimpleCartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      
      addToCart: (newItem) => set((state) => {
        const existingIndex = state.items.findIndex(item => item.id === newItem.id);
        if (existingIndex > -1) {
          const updated = [...state.items];
          updated[existingIndex].quantity += 1;
          return { items: updated };
        }
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((i) => i.id !== itemId)
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter((i) => i.id !== itemId)
          : state.items.map((i) => i.id === itemId ? { ...i, quantity } : i)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'chopnchop-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
