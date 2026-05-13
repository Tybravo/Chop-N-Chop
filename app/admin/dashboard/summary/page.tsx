"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { DashboardData } from "@/types/admin";
import { Loader2, LayoutDashboard } from "lucide-react";

export default function ViewSummaryPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData = await adminService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  const { stats } = data;

  return (
    <>
      {/* Title & Badge */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Platform Summary
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <LayoutDashboard className="w-4 h-4" />
          All Metrics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="admin-card p-6 shadow-md relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Total Orders</h3>
          <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{stats.totalOrders}</p>
          <p className="text-sm">
            <span className="text-green-600 dark:text-green-400 font-bold">{stats.ordersFromYesterday}+</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from yesterday</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-90 flex items-center justify-center text-7xl grayscale">
            🍔
          </div>
        </div>

        {/* Paid Orders Card */}
        <div className="admin-card p-6 shadow-md relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Paid Orders</h3>
          <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{stats.paidOrders}</p>
          <p className="text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-bold">{stats.pendingOrders}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">pending</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-90 flex items-center justify-center text-7xl grayscale">
            🥗
          </div>
        </div>

        {/* Active Batches Card */}
        <div className="bg-gradient-to-br from-purple-100 to-[#FC6B31]/30 dark:from-purple-900/60 dark:to-[#FC6B31]/40 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700/50 shadow-md relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Active Batches</h3>
          <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{stats.activeBatches}</p>
          <p className="text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-bold">{stats.readyForPickup}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">ready for pickup</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-90 flex items-center justify-center text-7xl grayscale">
            📦
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="admin-card p-6 shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Total Revenue</h3>
          <p className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">₦{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm">
            <span className="text-green-500 font-medium">+₦{stats.revenueFromYesterday.toLocaleString()}</span>
            <span className="text-gray-400 ml-1">from yesterday</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            💰
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="admin-card p-6 shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Total Customers</h3>
          <p className="text-5xl font-semibold text-gray-900 dark:text-white mb-2">{stats.totalCustomers.toLocaleString()}</p>
          <p className="text-sm">
            <span className="text-green-500 font-medium">+{stats.newCustomers}</span>
            <span className="text-gray-400 ml-1">new this week</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            👥
          </div>
        </div>

        {/* Active Vendors Card */}
        <div className="admin-card p-6 shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Active Vendors</h3>
          <p className="text-5xl font-semibold text-gray-900 dark:text-white mb-2">{stats.activeVendors}</p>
          <p className="text-sm">
            <span className="text-green-500 font-medium">+{stats.newVendors}</span>
            <span className="text-gray-400 ml-1">new this month</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            🏪
          </div>
        </div>

        {/* Active Riders Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Active Riders</h3>
          <p className="text-5xl font-semibold text-gray-900 dark:text-white mb-2">{stats.activeRiders}</p>
          <p className="text-sm">
            <span className="text-green-500 font-medium">+{stats.newRiders}</span>
            <span className="text-gray-400 ml-1">new this month</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            🛵
          </div>
        </div>

        {/* Pending Deliveries Card */}
        <div className="admin-card p-6 shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Pending Deliveries</h3>
          <p className="text-5xl font-semibold text-gray-900 dark:text-white mb-2">{stats.pendingDeliveries}</p>
          <p className="text-sm">
            <span className="text-red-500 font-medium">{stats.delayedDeliveries}</span>
            <span className="text-gray-400 ml-1">delayed</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            ⏱️
          </div>
        </div>

        {/* Rejected Deliveries Card */}
        <div className="admin-card p-6 shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Rejected Deliveries</h3>
          <p className="text-5xl font-semibold text-gray-900 dark:text-white mb-2">{stats.rejectedDeliveries}</p>
          <p className="text-sm">
            <span className="text-red-500 font-medium">{stats.rejectedThisWeek}</span>
            <span className="text-gray-400 ml-1">this week</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 dark:opacity-10 flex items-center justify-center text-7xl grayscale">
            🚫
          </div>
        </div>
      </div>
    </>
  );
}
