"use client";

import { useRouter } from "next/navigation";
import { Bike, CheckCircle2, Clock, Package, ChevronRight } from "lucide-react";

interface ActiveOrderTrackerProps {
  activeOrder?: {
    status: string;
    eta: string;
    zone: string;
    step: number;
  } | null;
}

const steps = [
  { label: "Confirmed", icon: CheckCircle2 },
  { label: "Prepared", icon: Package },
  { label: "On the way", icon: Bike },
];

export default function ActiveOrderTracker({ activeOrder }: ActiveOrderTrackerProps) {
  const router = useRouter();

  if (!activeOrder) return null;

  const currentStep = Math.max(1, Math.min(activeOrder.step, steps.length));

  return (
    <button
      type="button"
      onClick={() => router.push("/customer/drops")}
      aria-label={`View live tracking for order in ${activeOrder.zone}, estimated arrival ${activeOrder.eta}`}
      className="group md:hidden flex w-full flex-col rounded-[24px] border border-blue-800/50 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 p-5 text-left text-white shadow-xl shadow-blue-950/20 transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" aria-hidden="true" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-ping" aria-hidden="true" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300">Live drop tracking</span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-blue-700/50 bg-blue-800/40 px-3 py-1 text-[12px] font-bold text-blue-200">
          <Clock className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
          ETA: {activeOrder.eta}
        </div>
      </div>

      <div className="relative mb-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="mb-0.5 text-[16px] font-black tracking-tight">Out for delivery in {activeOrder.zone}</h3>
          <p className="text-[12px] text-blue-200/80">Rider is navigating your delivery zone</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/20 text-blue-400 transition-transform group-hover:scale-110">
          <Bike className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mt-3 flex w-full items-center justify-between border-t border-blue-800/60 pt-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const circleClass = isCompleted
            ? "bg-emerald-500 text-white"
            : isCurrent
              ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
              : "border border-gray-600 bg-blue-950 text-blue-300";

          return (
            <div key={step.label} className="relative z-10 flex w-[58px] flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${circleClass}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className={`mt-1 text-center text-[9px] font-bold leading-tight ${isCurrent ? "text-white" : "text-blue-200/70"}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-full top-4 h-0.5 w-[calc((100%_-_58px)_/_2)] -translate-y-1/2 ${
                    isCompleted ? "bg-emerald-500" : "bg-blue-700"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-blue-800/40 pt-3 text-[11px] font-bold text-blue-300">
        <span>Tap to view live map & verification code</span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </button>
  );
}
