'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface Slot {
  id: string;
  timeRange: string;
  isAvailable: boolean;
  surgeMultiplier?: number;
}

interface SlotSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  slots: Slot[];
  selectedSlotId?: string;
  onChange: (slotId: string) => void;
}

export function SlotSelector({ slots, selectedSlotId, onChange, className, ...props }: SlotSelectorProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)} {...props}>
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isSurge = slot.surgeMultiplier && slot.surgeMultiplier > 1;

        return (
          <button
            key={slot.id}
            type="button"
            disabled={!slot.isAvailable}
            onClick={() => onChange(slot.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 text-left transition-all",
              !slot.isAvailable && "opacity-50 bg-secondary-light/5 border-secondary-light/10 cursor-not-allowed",
              slot.isAvailable && !isSelected && "border-secondary-light/25 hover:border-primary/40 bg-background",
              isSelected && "border-primary bg-primary/10",
              isSurge && isSelected && "border-red-500 bg-red-50"
            )}
          >
            <span className={cn(
              "text-sm font-semibold",
              isSelected ? (isSurge ? "text-red-700" : "text-primary") : "text-foreground"
            )}>
              {slot.timeRange}
            </span>
            
            {isSurge && slot.isAvailable && (
              <span className="mt-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                ⚡ Surge Pricing
              </span>
            )}
            
            {!slot.isAvailable && (
              <span className="mt-1 text-xs font-medium text-foreground/60">
                Fully Booked
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
