'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, ChefHat, Truck, CheckCircle, ArrowLeft, Package } from 'lucide-react';

const TRACKING_STEPS = [
  { status: 'preparing', label: 'Order Confirmed', time: '9:05 AM', completed: true, icon: ChefHat },
  { status: 'preparing', label: 'Preparing', time: '9:15 AM', completed: true, icon: ChefHat },
  { status: 'out-for-delivery', label: 'Out for Delivery', time: '10:30 AM', completed: true, icon: Truck },
  { status: 'delivered', label: 'Delivered', time: '12:30 PM', completed: true, icon: CheckCircle },
];

export default function OrderTrackingPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/customer/orders" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Orders
      </Link>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #CHOP-9482A</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Placed on Sep 14, 2026 at 9:00 AM
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl font-black text-orange-500">₦7,000</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative">
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-orange-200 dark:bg-zinc-700" />
          <div className="space-y-6">
            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    step.completed
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${
                        step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{step.time}</span>
                    </div>
                    {idx === TRACKING_STEPS.length - 1 && step.completed && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                        Delivered successfully
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Package size={18} className="text-orange-500" />
            Items Ordered
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">1x Smoky Jollof & Chicken</span>
              <span className="font-medium text-gray-900 dark:text-white">₦5,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">2x Chilled Zobo Drink</span>
              <span className="font-medium text-gray-900 dark:text-white">₦2,000</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-orange-500" />
            Delivery Info
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-400">123 Admiralty Way, Lekki Phase 1</p>
            <p className="text-gray-600 dark:text-gray-400">From: Taste & See</p>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock size={12} />
              <span>Delivery slot: 12:00 PM - 1:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}