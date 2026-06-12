"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/vendor/order.service";
import { VendorOrder } from "@/types/vendor";
import { Check, ChefHat, Clock } from "lucide-react";

export default function PrepareModulePage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get PENDING and ACCEPTED orders
      const pending = await orderService.getOrders("PENDING");
      const accepted = await orderService.getOrders("ACCEPTED");
      setOrders([...pending, ...accepted]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: "ACCEPTED" | "PREPARING") => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      if (newStatus === "PREPARING") {
        // If it moves to preparing, it moves to the "Ready" module.
        setOrders(orders.filter(o => o.id !== orderId));
      } else {
        setOrders(orders.map(o => o.id === orderId ? updated : o));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prepare Meals</h1>
      </div>

      {orders.length === 0 ? (
        <div className="admin-card p-12 text-center flex flex-col items-center">
          <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No pending orders</h3>
          <p className="text-gray-500 mt-2">New orders will appear here for you to accept and prepare.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {orders.map((order) => (
              <div key={order.id} className="admin-card p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-[#FC6B31]">{order.id.toUpperCase()}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{order.customerName}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{item.quantity}x {item.mealName}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-xs text-gray-500 gap-1 pb-2">
                  <Clock className="w-4 h-4" /> Slot: {order.deliverySlot}
                </div>

                <div className="pt-2">
                  {order.status === "PENDING" ? (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, "ACCEPTED")}
                      className="w-full py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-medium hover:bg-[#FC6B31] dark:hover:bg-[#FC6B31] transition-colors flex justify-center items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Accept Order
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, "PREPARING")}
                      className="w-full py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex justify-center items-center gap-2"
                    >
                      <ChefHat className="w-4 h-4" /> Prepare Meal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden lg:block admin-card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FC6B31]">{order.id.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.items.map(item => `${item.quantity}x ${item.mealName}`).join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliverySlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {order.status === "PENDING" ? (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, "ACCEPTED")}
                          className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg hover:bg-[#FC6B31] dark:hover:bg-[#FC6B31] transition-colors"
                        >
                          Accept
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, "PREPARING")}
                          className="px-4 py-2 bg-[#FC6B31] text-white rounded-lg hover:bg-[#e35014] transition-colors"
                        >
                          Prepare
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
