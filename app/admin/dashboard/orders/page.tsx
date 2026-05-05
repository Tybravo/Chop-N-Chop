"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { Order } from "@/types/admin";
import { Loader2, PackageSearch } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await adminService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          All Orders
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <PackageSearch className="w-4 h-4" />
          {orders.length} Orders
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Order ID</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Meal</th>
                <th className="px-6 py-4 font-normal text-center">Qty</th>
                <th className="px-6 py-4 font-normal text-center">Payment</th>
                <th className="px-6 py-4 font-normal">Batch</th>
                <th className="px-6 py-4 font-normal">Destination</th>
                <th className="px-6 py-4 font-normal">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-medium">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{order.id}</td>
                  <td className="px-6 py-4 font-semibold">{order.customer}</td>
                  <td className="px-6 py-4">{order.meal}</td>
                  <td className="px-6 py-4 text-center">{order.qty}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.payment === "Paid"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-orange-50 text-orange-500 border border-orange-100"
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.batch}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.destination}</td>
                  <td className="px-6 py-4">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
