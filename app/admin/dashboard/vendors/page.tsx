"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Store, CheckCircle, XCircle, Ban, RefreshCw, Filter } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";
import { PendingVendorApplication } from "@/types/vendor";
import { VendorActionModal } from "@/components/admin/vendors/VendorActionModal";

type ActionType = "approve" | "reject" | "suspend";
type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED" | "UNVERIFIED";

const STATUS_BADGE_STYLES: Record<FilterStatus, string> = {
  ALL: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400",
  PENDING: "bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-400",
  APPROVED: "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400",
  SUSPENDED: "bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400",
  REJECTED: "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400",
  UNVERIFIED: "bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-400",
};

const FILTER_LABELS: Record<FilterStatus, string> = {
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
  UNVERIFIED: "Unverified",
};

// 3D embossed button styles
const ACTION_BUTTON_STYLES = {
  approve:
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 border-b-4 border-green-800 shadow-md hover:bg-green-500 hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
  reject:
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
  suspend:
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-yellow-500 border-b-4 border-yellow-700 shadow-md hover:bg-yellow-400 hover:border-yellow-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<PendingVendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("PENDING");

  const [selectedVendor, setSelectedVendor] = useState<PendingVendorApplication | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: PendingVendorApplication[];
      if (filterStatus === "ALL") {
        data = await vendorService.getAllVendors();
      } else if (filterStatus === "PENDING") {
        data = await vendorService.getPendingApplications();
      } else {
        data = await vendorService.getVendorsByStatus(filterStatus);
      }
      setVendors(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Unable to load vendor applications. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message || "Unable to load vendor applications. Please try again.");
      } else {
        setError("Unable to load vendor applications. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const filteredVendors = useMemo(() => {
    if (filterStatus === "ALL") return vendors;
    return vendors.filter((v) => v.status === filterStatus);
  }, [vendors, filterStatus]);

  const openAction = (vendor: PendingVendorApplication, action: ActionType) => {
    setSelectedVendor(vendor);
    setSelectedAction(action);
  };

  const closeAction = () => {
    setSelectedVendor(null);
    setSelectedAction(null);
  };

  const handleActionSuccess = (vendorId: string, action: ActionType) => {
    const newStatus: PendingVendorApplication["status"] =
      action === "approve" ? "APPROVED" : action === "suspend" ? "SUSPENDED" : "REJECTED";

    if (filterStatus === "ALL") {
      // Keep the vendor in the list but update its status
      setVendors((prev) =>
        prev.map((v) => (v.vendorProfileId === vendorId ? { ...v, status: newStatus } : v))
      );
    } else {
      // Remove the vendor from the list since it no longer matches the filter
      setVendors((prev) => prev.filter((v) => v.vendorProfileId !== vendorId));
    }
    closeAction();
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-4 h-24" />
      ))}
    </div>
  );

  const getEmptyStateMessage = () => {
    if (filterStatus === "ALL") {
      return "There are no vendor applications at the moment.";
    }
    return `There are no ${FILTER_LABELS[filterStatus].toLowerCase()} vendor applications at the moment.`;
  };

  return (
    <div className="pb-24 md:pb-8 relative min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Vendor Applications
            </h1>
            {!loading && !error && (
              <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/30">
                <Store className="w-4 h-4" />
                {filteredVendors.length} {filterStatus === "ALL" ? "Vendors" : FILTER_LABELS[filterStatus]}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review, approve, suspend, or reject vendor applications.
          </p>
        </div>

        <button
          onClick={fetchVendors}
          disabled={loading}
          className="hidden md:flex items-center gap-2 bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full sm:w-48 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC6B31]"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
              <option value="UNVERIFIED">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchVendors}
            className="bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {filterStatus === "ALL" ? "No vendor applications" : `No ${FILTER_LABELS[filterStatus].toLowerCase()} vendors`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {getEmptyStateMessage()}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 overflow-hidden transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-black/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Business Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    {filterStatus !== "ALL" && (
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.vendorProfileId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <Store className="w-5 h-5 text-[#FC6B31]" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{vendor.businessName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{vendor.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE_STYLES[vendor.status]}`}>
                          {vendor.status.charAt(0) + vendor.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      {filterStatus !== "ALL" && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {filterStatus === "APPROVED" ? (
                              <button
                                onClick={() => openAction(vendor, "suspend")}
                                className={ACTION_BUTTON_STYLES.suspend}
                              >
                                <Ban className="w-4 h-4" />
                                Suspend
                              </button>
                            ) : filterStatus === "SUSPENDED" || filterStatus === "REJECTED" ? (
                              <button
                                onClick={() => openAction(vendor, "approve")}
                                className={ACTION_BUTTON_STYLES.approve}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openAction(vendor, "approve")}
                                  className={ACTION_BUTTON_STYLES.approve}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => openAction(vendor, "reject")}
                                  className={ACTION_BUTTON_STYLES.reject}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.vendorProfileId}
                className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-4 transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <Store className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{vendor.businessName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{vendor.email}</p>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_BADGE_STYLES[vendor.status]}`}>
                    {vendor.status.charAt(0) + vendor.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {filterStatus === "ALL" ? null : filterStatus === "APPROVED" ? (
                  <button
                    onClick={() => openAction(vendor, "suspend")}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-yellow-500 border-b-4 border-yellow-700 shadow-md hover:bg-yellow-400 hover:border-yellow-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Ban className="w-4 h-4" />
                    Suspend
                  </button>
                ) : filterStatus === "SUSPENDED" || filterStatus === "REJECTED" ? (
                  <button
                    onClick={() => openAction(vendor, "approve")}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-green-600 border-b-4 border-green-800 shadow-md hover:bg-green-500 hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openAction(vendor, "approve")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-green-600 border-b-4 border-green-800 shadow-md hover:bg-green-500 hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => openAction(vendor, "reject")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile Refresh FAB */}
      <button
        onClick={fetchVendors}
        disabled={loading}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#FC6B31] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e55a20] active:scale-95 transition-all z-40 disabled:opacity-60"
      >
        <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
      </button>

      {/* Action Confirmation Modal */}
      {selectedVendor && selectedAction && (
        <VendorActionModal
          vendor={selectedVendor}
          action={selectedAction}
          isOpen={true}
          onClose={closeAction}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
}