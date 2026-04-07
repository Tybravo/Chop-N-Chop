'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { CheckCircle2, Clock, MapPin, ChefHat } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-secondary-light/5 py-12 px-4">
      <div className="max-w-md w-full bg-background rounded-3xl shadow-lg p-8 text-center border border-secondary-light/20">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-foreground/60 mb-8">
          Your order <span className="font-bold text-foreground">#CHOP-9482A</span> has been successfully placed and is now in the kitchen queue.
        </p>

        <div className="bg-secondary-light/5 rounded-2xl p-6 text-left space-y-4 mb-8 border border-secondary-light/20">
          <div className="flex items-start gap-4">
            <Clock className="text-primary shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-foreground/60 font-medium">Delivery Slot</p>
              <p className="font-bold text-foreground text-lg">12:00 PM - 1:00 PM</p>
            </div>
          </div>
          
          <div className="h-px bg-secondary-light/20 w-full" />
          
          <div className="flex items-start gap-4">
            <MapPin className="text-accent shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-foreground/60 font-medium">Delivery Address</p>
              <p className="font-bold text-foreground">123 Admiralty Way, Lekki Phase 1</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/orders" className="w-full">
            <Button variant="primary" className="w-full h-14 bg-secondary hover:bg-secondary-light text-secondary-foreground">
              Track Order
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full h-14">
              Return to Menu
            </Button>
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-foreground/50 flex items-center gap-2">
        <ChefHat size={16} />
        Freshly prepared, zero waste.
      </p>
    </div>
  );
}
