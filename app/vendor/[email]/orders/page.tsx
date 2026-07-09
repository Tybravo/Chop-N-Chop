"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/vendor/order.service";
import { VendorOrder, OrderStatus } from "@/types/vendor";
import { Search, Filter, X } from "lucide-react";

export default function ViewOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Selected Order for Drawer
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== "ALL") {
      result = result.filter(o => o.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await orderService.getOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED": return "bg-blue-100 text-blue-800";
      case "PREPARING": return "bg-orange-100 text-orange-800";
      case "READY": return "bg-teal-100 text-teal-800";
      case "OUT_FOR_DELIVERY": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "RETURNED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
            />
          </div>
          
          <div className="relative w-full sm:w-40">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31] appearance-none"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="OUT_FOR_DELIVERY">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} onClick={() => setSelectedOrder(order)} className="admin-card p-4 space-y-3 cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[#FC6B31]">{order.id.toUpperCase()}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{order.customerName}</h3>
                </div>
                <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-gray-900 dark:text-white">₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden lg:block admin-card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FC6B31]">{order.id.toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">₦{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedOrder(order)} className="text-[#FC6B31] hover:text-[#e35014]">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Drawer / Bottom Sheet */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedOrder(null)} />
          <div className={`fixed inset-x-0 bottom-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-96 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 rounded-t-2xl lg:rounded-none shadow-2xl flex flex-col h-[80vh] lg:h-full`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-[#FC6B31]">{selectedOrder.id.toUpperCase()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="flex gap-2">
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.mealName}</span>
                      </div>
                      <span className="font-medium">₦{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-[#FC6B31] text-lg">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
