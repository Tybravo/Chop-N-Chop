"use client";

import { useRouter } from "next/navigation";
import { Bike, CheckCircle2, Clock, Package, ChevronRight, ShieldCheck } from "lucide-react";

interface ActiveOrderTrackerProps {
  activeOrder?: {
    status: string;
    eta: string;
    zone: string;
    step: number;
    pickupCode?: string; 
  } | null;
}

const steps = [
  { label: "Confirmed", icon: CheckCircle2 },
  { label: "Prepared", icon: Package },
  { label: "On the way", icon: Bike },
];

export default function ActiveOrderTracker({ activeOrder }: ActiveOrderTrackerProps) {
  const router = useRouter();

  if (!activeOrder || activeOrder.status === "DELIVERED") return null;

  const currentStep = Math.max(1, Math.min(activeOrder.step, steps.length));

  return (
    <button
      type="button"
      onClick={() => router.push("/customer/tracking")}
      aria-label={`View live tracking for order in ${activeOrder.zone}, estimated arrival ${activeOrder.eta}`}
      className="group md:hidden flex w-full flex-col rounded-[24px] border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-[#18181B] dark:shadow-none p-5 text-left transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] relative overflow-hidden"
    >
      {/* Header */}
      <div className="relative mb-4 flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Active Ping using Brand Orange */}
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
      <div className="relative mb-5 flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="mb-0.5 text-[16px] font-black tracking-tight text-gray-900 dark:text-white">
            Out for delivery in {activeOrder.zone}
          </h3>
          <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
            Rider is navigating your delivery zone
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 shadow-sm transition-transform group-hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
          <Bike className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* VERIFICATION CODE BOX */}
      {activeOrder.pickupCode && activeOrder.status === "OUT_FOR_DELIVERY" && (
        <div className="relative z-10 mb-5 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3.5 shadow-sm dark:border-zinc-700 dark:bg-[#27272A]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Verification Code
              </p>
              <p className="mt-0.5 text-[12px] font-bold text-gray-900 dark:text-white">
                Show rider to confirm
              </p>
            </div>
          </div>
          
          {/* HIGH CONTRAST INVERTED PILL */}
          <div className="flex items-center justify-center rounded-xl bg-gray-900 px-3.5 py-1.5 shadow-md dark:bg-white dark:shadow-white/10">
            <span className="font-mono text-[17px] font-black tracking-widest text-white dark:text-gray-900">
              {activeOrder.pickupCode}
            </span>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      <div className="relative mt-2 flex w-full items-center justify-between border-t border-gray-100 pt-5 dark:border-zinc-800">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          
          const circleClass = isCompleted
            ? "bg-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/20"
            : isCurrent
              ? "bg-[#FC6B31] text-white ring-4 ring-orange-100 dark:ring-orange-500/20 border-transparent shadow-md shadow-orange-500/20"
              : "border-2 border-gray-200 bg-white text-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400";

          return (
            <div key={step.label} className="relative z-10 flex w-[58px] flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${circleClass}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className={`mt-2 text-center text-[10px] font-bold leading-tight ${isCurrent ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-full top-4 h-[3px] w-[calc((100%_-_58px)_/_2)] -translate-y-1/2 transition-colors duration-300 ${
                    isCompleted ? "bg-emerald-500" : "bg-gray-200 dark:bg-zinc-700"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Cue */}
      <div className="mt-5 flex w-full items-center justify-between border-t border-gray-100 pt-3 text-[12px] font-bold text-gray-600 dark:border-zinc-800 dark:text-gray-300">
        <span>Tap to view live map</span>
        <ChevronRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </button>
  );
}