'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';

// Mock Order Data
const MOCK_ORDERS = [
  {
    id: 'CHOP-9482A',
    date: '2026-04-07T10:30:00Z',
    status: 'cooking', // pending, cooking, delivering, delivered
    total: 10300,
    slot: '12:00 PM - 1:00 PM',
    items: [
      { name: 'Jollof Rice & Grilled Chicken', qty: 2 },
      { name: 'Chilled Zobo Drink', qty: 1 }
    ]
  },
  {
    id: 'CHOP-7731B',
    date: '2026-04-06T09:15:00Z',
    status: 'delivered',
    total: 4500,
    slot: '1:00 PM - 2:00 PM',
    items: [
      { name: 'Pounded Yam & Egusi', qty: 1 }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cooking': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'delivering': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrdersPage() {
  return (
    <div className="bg-secondary-light/5 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-black text-foreground mb-8 flex items-center gap-3">
          <ShoppingBag className="text-primary" />
          My Orders
        </h1>

        {MOCK_ORDERS.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-xl overflow-hidden border border-[#fd8b5d] dark:border-[#e35014] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(252,107,49,0.4)] dark:hover:shadow-[0_0_25px_rgba(252,107,49,0.6)] text-center">
            <ShoppingBag size={48} className="mx-auto text-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-foreground/60 mb-6">You haven&apos;t placed any orders with us yet.</p>
            <Link href="/">
              <Button>
                Start Ordering
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-[#fd8b5d] dark:border-[#e35014] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(252,107,49,0.4)] dark:hover:shadow-[0_0_25px_rgba(252,107,49,0.6)]"
              >
                <div className="p-6 border-b border-secondary-light/10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-foreground/60 font-medium mb-1">
                        Order {order.id} • {new Date(order.date).toLocaleDateString()}
                      </p>
                      <h3 className="text-xl font-bold text-foreground">
                        ₦{order.total.toLocaleString()}
                      </h3>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-secondary-light/10">
                    <div className="flex items-center gap-2 text-sm text-foreground/70 font-medium">
                      <Clock size={16} className="text-primary" />
                      {order.slot}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70 font-medium">
                      <MapPin size={16} className="text-accent" />
                      123 Admiralty Way
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-light/5 p-4 px-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center text-xs font-medium text-foreground/70 bg-background border border-secondary-light/25 px-3 py-1 rounded-lg"
                      >
                        {item.qty}x {item.name}
                      </span>
                    ))}
                  </div>
                  
                  <button className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                    Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
