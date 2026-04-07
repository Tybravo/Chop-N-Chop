'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  targetDate: string | Date;
  onExpire?: () => void;
}

export function CountdownTimer({ targetDate, onExpire, className, ...props }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        if (onExpire) onExpire();
        return;
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
        minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
        seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <span className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-2">
        Order Window Closes In
      </span>
      <div className="flex gap-4 text-center">
        <div className="flex flex-col bg-background p-3 rounded-lg shadow-sm border border-secondary-light/20 min-w-[70px]">
          <span className="text-3xl font-bold text-primary">{timeLeft.hours}</span>
          <span className="text-xs font-medium text-foreground/45">HRS</span>
        </div>
        <span className="text-3xl font-bold text-foreground/30 self-center pb-4">:</span>
        <div className="flex flex-col bg-background p-3 rounded-lg shadow-sm border border-secondary-light/20 min-w-[70px]">
          <span className="text-3xl font-bold text-primary">{timeLeft.minutes}</span>
          <span className="text-xs font-medium text-foreground/45">MIN</span>
        </div>
        <span className="text-3xl font-bold text-foreground/30 self-center pb-4">:</span>
        <div className="flex flex-col bg-background p-3 rounded-lg shadow-sm border border-secondary-light/20 min-w-[70px]">
          <span className="text-3xl font-bold text-red-500 animate-pulse">{timeLeft.seconds}</span>
          <span className="text-xs font-medium text-foreground/45">SEC</span>
        </div>
      </div>
    </div>
  );
}
