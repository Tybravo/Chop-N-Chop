"use client";

import { useState, useEffect } from "react";
import { vendorService } from "@/services/vendor/vendor.service";
import { VendorDashboardStats } from "@/types/vendor";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  RotateCcw,
  Power,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText
} from "lucide-react";

const emptyStats: VendorDashboardStats = {
  totalOrders: 0,
  acceptedOrders: 0,
  dispatchedOrders: 0,
  deliveredOrders: 0,
  returnedOrders: 0,
  totalEarnings: 0,
  completedOrdersEarnings: 0,
  availableBalance: 0,
};

export default function VendorDashboardPage() {
  const { user, updateUser } = useVendorAuth();
  const [stats, setStats] = useState<VendorDashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await vendorService.getStats();
        setStats(statsData);
      } catch (error) {
        console.warn("Stats API unavailable, showing empty state:", error);
        setStats(emptyStats);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleStatus = () => {
    if (!user) return;
    updateUser({ isStoreOnline: !user.isStoreOnline });
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div>
      </div>
    );
  }

  // Vendor status badge
  const getVendorStatusBadge = () => {
    switch (user.vendorStatus) {
      case "APPROVED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full text-sm font-medium text-green-700 dark:text-green-300">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            Pending Approval
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full text-sm font-medium text-red-700 dark:text-red-300">
            <Shield className="w-4 h-4" />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
            <AlertTriangle className="w-4 h-4" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  // KYC status badge
  const getKycStatusBadge = () => {
    switch (user.kycStatus) {
      case "NOT_SUBMITTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />
            KYC Not Submitted
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            KYC Under Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full text-sm font-medium text-green-700 dark:text-green-300">
            <Shield className="w-4 h-4" />
            KYC Verified
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full text-sm font-medium text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4" />
            KYC Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Accepted", value: stats.acceptedOrders, icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { title: "Dispatched", value: stats.dispatchedOrders, icon: Truck, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { title: "Delivered", value: stats.deliveredOrders, icon: PackageCheck, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { title: "Returned", value: stats.returnedOrders, icon: RotateCcw, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  const workflowStages = [
    "PENDING", "ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"
  ];

  return (
    <div className="space-y-6">
      {/* Vendor Status & KYC Status */}
      <div className="admin-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {getVendorStatusBadge()}
          {getKycStatusBadge()}
        </div>
      </div>

      {/* Store Status Card — shares state with the navbar online toggle via useVendorAuth */}
      <div className="admin-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Store Status</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user.isStoreOnline 
              ? "Your store is open and receiving orders." 
              : "Your store is closed. You will not receive new orders."}
          </p>
        </div>
        <button
      
          onClick={handleToggleStatus}
          disabled={user.vendorStatus === "PENDING" || user.vendorStatus === "SUSPENDED" || !user.kycCompleted}
          className={`relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 ${
            user.isStoreOnline ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-gray-700"
          } ${user.vendorStatus === "PENDING" || user.vendorStatus === "SUSPENDED" || !user.kycCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="sr-only">Toggle store status</span>
          <span
            className={`pointer-events-none flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              user.isStoreOnline ? "translate-x-5" : "-translate-x-5"
            }`}
          >
            <Power className={`h-4 w-4 ${user.isStoreOnline ? "text-[#FC6B31]" : "text-gray-400"}`} />
          </span>
        </button>
      </div>

      {/* Summary Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h3>
        {/* Mobile: Horizontal carousel, Desktop: Grid */}
        <div className="flex overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-5 gap-4 py-2 pb-4 snap-x snap-mandatory hide-scrollbar">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="admin-card min-w-[200px] lg:min-w-0 flex-shrink-0 snap-start p-5 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Workflow</h3>
        
        {/* Desktop Horizontal Stepper */}
        <div className="hidden lg:flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
          {workflowStages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 px-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 z-10">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wider">
                {stage.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden flex flex-col gap-6 relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
          {workflowStages.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 z-10 shrink-0">
                {idx + 1}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider">
                {stage.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
