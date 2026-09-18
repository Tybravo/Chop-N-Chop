'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, ChefHat, Package, Truck, CheckCircle, ArrowLeft } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'CHOP-9482A',
    status: 'delivered',
    date: '2026-09-14',
    time: '12:30 PM',
    items: [
      { name: 'Smoky Jollof & Chicken', quantity: 1, price: 5000 },
      { name: 'Chilled Zobo Drink', quantity: 2, price: 1000 },
    ],
    total: 7000,
    vendor: 'Taste & See',
    address: '123 Admiralty Way, Lekki Phase 1',
  },
  {
    id: 'CHOP-9481B',
    status: 'preparing',
    date: '2026-09-14',
    time: '12:30 PM',
    items: [
      { name: 'Spaghetti With Meatballs', quantity: 1, price: 4500 },
    ],
    total: 4500,
    vendor: 'The Brunch Club',
    address: '123 Admiralty Way, Lekki Phase 1',
  },
  {
    id: 'CHOP-9479C',
    status: 'out-for-delivery',
    date: '2026-09-13',
    time: '1:00 PM',
    items: [
      { name: 'Loaded Fries with Coke', quantity: 1, price: 6500 },
    ],
    total: 6500,
    vendor: 'Foodies Spot',
    address: '123 Admiralty Way, Lekki Phase 1',
  },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  'out-for-delivery': { label: 'Out for Delivery', icon: Truck, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
};

export default function OrdersPage() {
  const [filter, setFilter] = React.useState('all');

  const filteredOrders = filter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === filter);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track and view your order history
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {['all', 'preparing', 'out-for-delivery', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              filter === status
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-800'
            }`}
          >
            {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link href="/customer/explore">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Browse Menu
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Package;
            const statusStyle = statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">#{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusStyle}`}>
                        <StatusIcon size={10} className="inline mr-1" />
                        {statusConfig[order.status]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.date} at {order.time}
                    </p>
                  </div>
                  <span className="font-extrabold text-gray-900 dark:text-white">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {order.address}
                    </span>
                    <span>From: {order.vendor}</span>
                  </div>
                  <Link href={`/customer/orders/${order.id}/tracking`}>
                    <button className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                      Track Order →
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}