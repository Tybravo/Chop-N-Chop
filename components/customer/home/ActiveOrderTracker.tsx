"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, CheckCircle2, Clock, Layers, ChefHat, ShieldCheck, ChevronRight } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";

// --- API Type ---
interface ApiActiveOrder {
  id: string;
  status: "CONFIRMED" | "PREPARING" | "CONSOLIDATING" | "OUT_FOR_DELIVERY" | "DELIVERED";
  eta: string;
  zone: string;
  pickupCode?: string; 
}

const steps = [
  { label: "Confirmed", icon: CheckCircle2 },
  { label: "Preparing", icon: ChefHat },
  { label: "Consolidating", icon: Layers },
  { label: "On the way", icon: Bike },
];

export default function ActiveOrderTracker() {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<ApiActiveOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the active order on mount and set up polling for live updates
  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        // NOTE: Adjust this endpoint if your backend uses a different path (e.g., /api/v1/orders/current)
        const res = await customerApiClient.get("/api/v1/orders/active");
        
        // Assuming the API returns the order object directly, or null/404 if no active orders exist
        if (res.data) {
          setActiveOrder(res.data);
        } else {
          setActiveOrder(null);
        }
      } catch (error) {
        console.error("Failed to fetch active order:", error);
        // If 404 Not Found, it just means no active orders
        setActiveOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveOrder();

    // Poll every 30 seconds for live tracking updates
    const intervalId = setInterval(fetchActiveOrder, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Hide the tracker if loading, if there's no active order, or if it's already delivered
  if (isLoading || !activeOrder || activeOrder.status === "DELIVERED") {
    return null; 
  }

  // Map backend string status to UI progress steps
  const getStepNumber = (status: string) => {
    switch (status) {
      case "CONFIRMED": return 1;
      case "PREPARING": return 2;
      case "CONSOLIDATING": return 3;
      case "OUT_FOR_DELIVERY": return 4;
      default: return 1;
    }
  };

  const currentStep = getStepNumber(activeOrder.status);

  // Dynamic messaging based on the hub logistics state
  const getStatusMessage = () => {
    switch (activeOrder.status) {
      case "PREPARING":
        return {
          title: "Kitchens are preparing your meal",
          subtitle: "Vendors are getting your food ready",
        };
      case "CONSOLIDATING":
        return {
          title: "Hub is packaging your order",
          subtitle: "Consolidating items for a single drop",
        };
      case "OUT_FOR_DELIVERY":
        return {
          title: `Out for delivery in ${activeOrder.zone}`,
          subtitle: "Rider is navigating your delivery zone",
        };
      default:
        return {
          title: "Order Confirmed",
          subtitle: "Waiting for kitchens to start preparing",
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <button
      type="button"
      onClick={() => router.push(`/customer/tracking/${activeOrder.id}`)}
      aria-label={`View live tracking for order in ${activeOrder.zone}, estimated arrival ${activeOrder.eta}`}
      className="group md:hidden flex w-full flex-col rounded-[24px] border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-[#18181B] dark:shadow-none p-5 text-left transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] relative overflow-hidden"
    >
      {/* --- FADED MAP BACKGROUND & TOPOLOGY LAYER --- */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.10] pointer-events-none bg-cover bg-center transition-opacity"
        style={{ backgroundImage: `url('/map.png')` }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#FC6B31_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

      {/* Header */}
      <div className="relative z-10 mb-4 flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FC6B31] animate-ping" aria-hidden="true" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            Live drop tracking
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[12px] font-bold text-[#FC6B31] dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          ETA: {activeOrder.eta}
        </div>
      </div>

      {/* Primary Status Title */}
      <div className="relative z-10 mb-5 flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="mb-0.5 text-[16px] font-black tracking-tight text-gray-900 dark:text-white truncate">
            {statusMessage.title}
          </h3>
          <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300 truncate">
            {statusMessage.subtitle}
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 shadow-sm transition-transform group-hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
          <Bike className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* VERIFICATION CODE BOX - Only shown when Out for Delivery */}
      {activeOrder.pickupCode && activeOrder.status === "OUT_FOR_DELIVERY" && (
        <div className="relative z-10 mb-5 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/90 backdrop-blur-xs p-3.5 shadow-sm dark:border-zinc-700 dark:bg-[#27272A]/90 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Verification Code
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-gray-900 dark:text-white truncate">
                Show rider to confirm
              </p>
            </div>
          </div>
          
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-gray-900 px-3.5 py-1.5 shadow-md dark:bg-white dark:shadow-white/10 ml-2">
            <span className="font-mono text-[17px] font-black tracking-widest text-white dark:text-gray-900">
              {activeOrder.pickupCode}
            </span>
          </div>
        </div>
      )}

      {/* Progress Tracker with 4 Steps */}
      <div className="relative z-10 mt-2 flex w-full items-center justify-between border-t border-gray-100 pt-5 dark:border-zinc-800">
        {/* Background Track Line */}
        <div className="absolute top-[36px] left-[10%] right-[10%] h-[3px] bg-gray-200 dark:bg-zinc-700 -translate-y-1/2" aria-hidden="true" />
        
        {/* Active Track Line */}
        <div 
          className="absolute top-[36px] left-[10%] h-[3px] bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 80}%` }}
          aria-hidden="true" 
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          
          const circleClass = isCompleted
            ? "bg-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/20"
            : isCurrent
              ? "bg-[#FC6B31] text-white ring-4 ring-orange-100 dark:ring-orange-500/20 border-transparent shadow-md shadow-orange-500/20"
              : "border-2 border-gray-200 bg-white text-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500";

          return (
            <div key={step.label} className="relative z-10 flex w-14 flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${circleClass}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className={`mt-2 text-center text-[10px] font-bold leading-tight ${isCurrent ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Cue */}
      <div className="relative z-10 mt-5 flex w-full items-center justify-between border-t border-gray-100 pt-3 text-[12px] font-bold text-gray-600 dark:border-zinc-800 dark:text-gray-300">
        <span>Tap to view live map</span>
        <ChevronRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </button>
  );
}