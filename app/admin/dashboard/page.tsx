"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { adminService } from "@/lib/api/admin.service";
import { DashboardData } from "@/types/admin";
import { Loader2, ArrowRight, CheckCircle2, User, WalletCards, XCircle, Truck } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
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
      <AdminLayout>
        <div className="h-full flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
        </div>
      </AdminLayout>
    );
  }

  const { stats, recentOrders, dispatchStatus, issues, performance } = data;

  return (
    <AdminLayout>
      {/* Title & Badge */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Today&apos;s Drop Operations
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <span className="w-2 h-2 rounded-full bg-[#FC6B31]"></span>
          Dispatch live
        </span>
      </div>

      {/* Top 3 Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
          <p className="text-5xl font-semibold text-gray-900 mb-2">{stats.totalOrders}</p>
          <p className="text-sm">
            <span className="text-green-500 font-medium">{stats.ordersFromYesterday}+</span>
            <span className="text-gray-400 ml-1">from yesterday</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-80 flex items-center justify-center text-7xl">
            🍔
          </div>
        </div>

        {/* Paid Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-gray-500 font-medium mb-2">Paid Orders</h3>
          <p className="text-5xl font-semibold text-gray-900 mb-2">{stats.paidOrders}</p>
          <p className="text-sm">
            <span className="text-gray-500 font-medium">{stats.pendingOrders}</span>
            <span className="text-gray-400 ml-1">pending</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-80 flex items-center justify-center text-7xl">
            🥗
          </div>
        </div>

        {/* Active Batches Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <h3 className="text-gray-500 font-medium mb-2">Active Batches</h3>
          <p className="text-5xl font-semibold text-gray-900 mb-2">{stats.activeBatches}</p>
          <p className="text-sm">
            <span className="text-gray-500 font-medium">{stats.readyForPickup}</span>
            <span className="text-gray-400 ml-1">ready for pickup</span>
          </p>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-80 flex items-center justify-center text-7xl">
            📦
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Orders & Performance) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold">Today&apos;s Orders</h2>
              </div>
              <button className="text-[#FC6B31] text-sm font-medium flex items-center gap-1 hover:underline">
                All orders <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-400 font-medium bg-white">
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
                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4">{order.meal}</td>
                      <td className="px-6 py-4 text-center">{order.qty}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.payment === "Paid"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-orange-50 text-orange-500 border border-orange-100"
                          }`}
                        >
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.batch}</td>
                      <td className="px-6 py-4">{order.destination}</td>
                      <td className="px-6 py-4">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Performance */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold">Delivery Performance</h2>
              </div>
              <button className="text-[#FC6B31] text-sm font-medium flex items-center gap-1 hover:underline">
                View report <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-500 font-medium text-sm">Completed Batches</span>
                  <span className="text-2xl font-bold text-gray-900">{performance.completedBatches}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#FC6B31] h-2 rounded-full" style={{ width: `${performance.completedBatches}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-500 font-medium text-sm">Delayed Batches</span>
                  <span className="text-2xl font-bold text-gray-900">{performance.delayedBatches}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#FC6B31] h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-500 font-medium text-sm">On-Time Rate</span>
                  <span className="text-2xl font-bold text-gray-900">{performance.onTimeRate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#FC6B31] h-2 rounded-full" style={{ width: `${performance.onTimeRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-500 font-medium text-sm">Handover Success</span>
                  <span className="text-2xl font-bold text-gray-900">{performance.handoverSuccess}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#FC6B31] h-2 rounded-full" style={{ width: `${performance.handoverSuccess}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Dispatch Status & Issues) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Dispatch Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold">Dispatch Status</h2>
              </div>
              <button className="text-[#FC6B31] text-sm font-medium flex items-center gap-1 hover:underline">
                View activity <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {dispatchStatus.map((rider) => (
                <div key={rider.id} className="flex items-start gap-4">
                  <div className="relative w-10 h-10">
                    <Image 
                      src={rider.avatarUrl} 
                      alt={rider.name} 
                      fill
                      sizes="40px"
                      className="rounded-full object-cover border border-gray-200" 
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {rider.name} <span className="text-gray-400 font-normal">- {rider.batch}</span>
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        rider.status === 'In Transit' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                        rider.status === 'Awaiting Pickup' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                        'bg-red-50 text-red-500 border border-red-100'
                      }`}>
                        {rider.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span>{rider.location}</span>
                      <span className="mx-1">•</span>
                      <span>{rider.eta ? `ETA ${rider.eta}` : rider.delay}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues & Updates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold">Issues & Updates</h2>
              </div>
              <button className="text-[#FC6B31] text-sm font-medium flex items-center gap-1 hover:underline">
                View updates <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {issues.map((issue) => (
                <div key={issue.id} className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    {issue.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {issue.type === 'warning' && (issue.title.includes("Unassigned") ? <User className="w-5 h-5 text-yellow-500" /> : <WalletCards className="w-5 h-5 text-yellow-500" />)}
                    {issue.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{issue.title}</h4>
                    <p className="text-xs text-gray-500">{issue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
