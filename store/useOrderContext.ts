import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ResolvedZone {
  zoneId: string;
  zoneName: string;
  deliveryFee: number;
  estimatedDeliveryMinutes?: number;
  latitude?: number;
  longitude?: number;
}

interface OrderContextState {
  // State
  location: string | null;
  deliveryWindow: string | null;
  isGatewayComplete: boolean;
  resolvedZone: ResolvedZone | null;
  deliveryFee: number;

  // Actions
  setLocation: (location: string) => void;
  setDeliveryWindow: (windowId: string) => void;
  confirmGateway: () => void;
  resetContext: () => void;
  setResolvedZone: (zone: ResolvedZone | null) => void;
  setDeliveryFee: (fee: number) => void;
}

export const useOrderContext = create<OrderContextState>()(
  persist(
    (set) => ({
      location: null,
      deliveryWindow: null,
      isGatewayComplete: false,
      resolvedZone: null,
      deliveryFee: 1500,

      setLocation: (location) => set({ location }),
      setDeliveryWindow: (windowId) => set({ deliveryWindow: windowId }),
      
      confirmGateway: () => set({ isGatewayComplete: true }),
      
      resetContext: () => set({ 
        location: null, 
        deliveryWindow: null, 
        isGatewayComplete: false,
        resolvedZone: null,
        deliveryFee: 1500,
      }),
      setResolvedZone: (zone) => set({ 
        resolvedZone: zone,
        deliveryFee: zone?.deliveryFee ?? 1500,
      }),
      setDeliveryFee: (fee) => set({ deliveryFee: fee }),
    }),
    {
      name: 'chopnchop-context', // Key used in localStorage
    }
  )
);