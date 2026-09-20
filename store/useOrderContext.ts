import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderContextState {
  // State
  location: string | null;
  deliveryWindow: string | null;
  isGatewayComplete: boolean;

  // Actions
  setLocation: (location: string) => void;
  setDeliveryWindow: (windowId: string) => void;
  confirmGateway: () => void;
  resetContext: () => void;
}

export const useOrderContext = create<OrderContextState>()(
  persist(
    (set) => ({
      location: null,
      deliveryWindow: null,
      isGatewayComplete: false,

      setLocation: (location) => set({ location }),
      setDeliveryWindow: (windowId) => set({ deliveryWindow: windowId }),
      
      confirmGateway: () => set({ isGatewayComplete: true }),
      
      resetContext: () => set({ 
        location: null, 
        deliveryWindow: null, 
        isGatewayComplete: false 
      }),
    }),
    {
      name: 'chopnchop-context', // Key used in localStorage
    }
  )
);