import * as React from 'react';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types/menu';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function Card({ item, onAddToCart, className, ...props }: CardProps) {
  const isSoldOut = item.isSoldOut || item.stock <= 0;
  
  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-background border border-secondary-light/20 transition-transform transform-gpu cnc-card-shadow cnc-breath-card",
        className
      )}
      {...props}
    >
      <div className="aspect-4/3 w-full bg-secondary-light/10 overflow-hidden relative">
        {/* Placeholder for actual Next/Image */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
        <div className="w-full h-full bg-secondary-light/20 object-cover" />
        
        {/* Badge */}
        {isSoldOut ? (
          <div className="absolute top-3 left-3 z-20 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
            SOLD OUT
          </div>
        ) : item.stock < 10 ? (
          <div className="absolute top-3 left-3 z-20 rounded bg-orange-500 px-2 py-1 text-xs font-bold text-white">
            SELLING FAST
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
          <span className="font-bold text-primary">₦{item.price.toLocaleString()}</span>
        </div>
        
        <p className="mt-2 text-sm text-foreground/65 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-4">
          <ProgressBar 
            current={item.stock} 
            max={item.maxStock} 
            label="Remaining Portions" 
          />
        </div>

        <Button 
          className="mt-4 w-full" 
          disabled={isSoldOut}
          onClick={() => onAddToCart(item)}
        >
          {isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
