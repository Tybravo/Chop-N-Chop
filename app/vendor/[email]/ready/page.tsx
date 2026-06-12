"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/vendor/order.service";
import { VendorOrder } from "@/types/vendor";
import { PackageCheck, Truck, CheckCircle } from "lucide-react";

export default function ReadyModulePage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const preparing = await orderService.getOrders("PREPARING");
      const ready = await orderService.getOrders("READY");
      setOrders([...preparing, ...ready]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: "READY" | "OUT_FOR_DELIVERY") => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      if (newStatus === "OUT_FOR_DELIVERY") {
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

  const hasReadyOrders = orders.some(o => o.status === "READY");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ready Meals</h1>
        {hasReadyOrders && (
          <button 
            className="px-4 py-2 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Dispatch All Ready
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="admin-card p-12 text-center flex flex-col items-center">
          <PackageCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No meals in preparation</h3>
          <p className="text-gray-500 mt-2">Accept and prepare orders from the Prepare module.</p>
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
                    order.status === "PREPARING" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
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

                <div className="pt-2">
                  {order.status === "PREPARING" ? (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, "READY")}
                      className="w-full py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-medium hover:bg-[#FC6B31] dark:hover:bg-[#FC6B31] transition-colors flex justify-center items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as Ready
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, "OUT_FOR_DELIVERY")}
                      className="w-full py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex justify-center items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Dispatch Meal
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "PREPARING" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {order.status === "PREPARING" ? (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, "READY")}
                          className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg hover:bg-[#FC6B31] dark:hover:bg-[#FC6B31] transition-colors"
                        >
                          Mark Ready
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, "OUT_FOR_DELIVERY")}
                          className="px-4 py-2 bg-[#FC6B31] text-white rounded-lg hover:bg-[#e35014] transition-colors"
                        >
                          Dispatch
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
