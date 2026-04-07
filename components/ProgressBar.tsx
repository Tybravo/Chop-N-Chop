import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  max: number;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({ 
  current, 
  max, 
  label, 
  showValue = true,
  className,
  ...props 
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1 text-xs font-medium text-foreground/70">
          {label && <span>{label}</span>}
          {showValue && <span>{current} / {max}</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-light/20">
        <div 
          className={cn("h-full transition-all duration-500 ease-in-out", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
