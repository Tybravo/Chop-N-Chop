import { customerApiClient } from "@/lib/api/customerApiClient";

export interface ResolvedZone {
  zoneId: string;
  zoneName: string;
  deliveryFee: number;
  estimatedDeliveryMinutes?: number;
  baseDeliveryFee?: number;
  id?: string;
  name?: string;
}

export interface Zone {
  id: string;
  name: string;
  code?: string;
  description?: string;
  hubId?: string;
  status?: string;
  baseDeliveryFee?: number;
  estimatedDeliveryMinutes?: number;
  boundary?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const zoneService = {
  async resolveLocation(latitude: number, longitude: number): Promise<ResolvedZone> {
    const response = await customerApiClient.get("/api/v1/zones/resolve", {
      params: { latitude, longitude },
    });
    const data = response.data;
    return {
      zoneId: data.zoneId || data.id,
      zoneName: data.zoneName || data.name,
      deliveryFee: data.deliveryFee ?? data.baseDeliveryFee ?? 0,
      estimatedDeliveryMinutes: data.estimatedDeliveryMinutes,
      ...data,
    };
  },

  async getAllZones(): Promise<Zone[]> {
    const response = await customerApiClient.get("/api/v1/zones");
    return Array.isArray(response.data) ? response.data : response.data?.content || [];
  },

  async getZoneById(zoneId: string): Promise<Zone> {
    const response = await customerApiClient.get(`/api/v1/zones/${zoneId}`);
    return response.data;
  },
};
