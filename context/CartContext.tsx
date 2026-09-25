import { create } from "zustand";

export interface CartItem {
  id: string | number;
  name: string;
  desc: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [
    {
      id: 1,
      name: "Melting Cheese Pizza",
      desc: "Vendor A • 8'' Small",
      price: 11880,
      quantity: 1,
      image: "/hero-food-illustration.png"
    },
    {
      id: 2,
      name: "Chicken Salad",
      desc: "Vendor B • Medium",
      price: 4560,
      quantity: 2,
      image: "/hero-food-illustration.png"
    }
  ],
  addToCart: (newItem) => set((state) => {
    const existingIndex = state.cartItems.findIndex(item => item.id === newItem.id);
    if (existingIndex > -1) {
      const updated = [...state.cartItems];
      updated[existingIndex].quantity += 1;
      return { cartItems: updated };
    }
    return { cartItems: [...state.cartItems, { ...newItem, quantity: 1 }] };
  }),
  updateQuantity: (id, delta) => set((state) => {
    return {
      cartItems: state.cartItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    };
  }),
  clearCart: () => set({ cartItems: [] }),
}));