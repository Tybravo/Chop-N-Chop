"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Loader2, AlertCircle, Navigation } from "lucide-react";
import { zoneService, ResolvedZone } from "@/services/customer/zone.service";

export default function LocationPage() {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [resolvedZone, setResolvedZone] = useState<ResolvedZone | null>(null);

  const handleUseCurrentLocation = async () => {
    setError("");
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const zone = await zoneService.resolveLocation(latitude, longitude);
      setResolvedZone(zone);
      
      localStorage.setItem("chopnchop_delivery_zone", JSON.stringify({
        zoneId: zone.zoneId || zone.id,
        zoneName: zone.zoneName || zone.name,
        deliveryFee: zone.deliveryFee,
        estimatedDeliveryMinutes: zone.estimatedDeliveryMinutes,
        latitude,
        longitude,
      }));
      
      router.back();
    } catch (err) {
      const error = err as Error & { code?: number; response?: { status?: number } };
      if (error.code === 1) {
        setError("Location permission denied. Please enable location access.");
      } else if (error.code === 3) {
        setError("Location request timed out. Please try again.");
      } else if (error.response?.status === 404 || error.response?.status === 400) {
        setError("Sorry, we don't deliver to this location yet.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to detect location. Please try again.");
      }
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Select Delivery Location</h1>
        </div>

        <div className="p-4 space-y-4">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center gap-3 p-4 bg-[#FC6B31]/10 border border-[#FC6B31]/30 rounded-xl text-[#FC6B31] hover:bg-[#FC6B31]/20 transition-colors disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <div className="flex-1 text-left">
              <p className="font-bold">Use current location</p>
              <p className="text-sm opacity-80">Get your precise delivery location</p>
            </div>
          </button>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {resolvedZone && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <MapPin className="w-5 h-5" />
                <p className="font-bold">{resolvedZone.zoneName || resolvedZone.name}</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Delivery fee: ₦{resolvedZone.deliveryFee?.toLocaleString() || 0}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
