"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Store, CheckCircle, Ban, XCircle, RefreshCw } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";
import { PendingVendorApplication } from "@/types/vendor";
import { VendorActionModal } from "@/components/admin/vendors/VendorActionModal";

type ActionType = "approve" | "suspend" | "reject";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<PendingVendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVendor, setSelectedVendor] = useState<PendingVendorApplication | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorService.getPendingApplications();
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
  }, []);

  const openAction = (vendor: PendingVendorApplication, action: ActionType) => {
    setSelectedVendor(vendor);
    setSelectedAction(action);
  };

  const closeAction = () => {
    setSelectedVendor(null);
    setSelectedAction(null);
  };

  const handleActionSuccess = (vendorId: string) => {
    // Remove the vendor from the pending list once an action is taken
    setVendors((prev) => prev.filter((v) => v.vendorProfileId !== vendorId));
    closeAction();
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-4 h-24" />
      ))}
    </div>
  );

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
                {vendors.length} Pending
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
      ) : vendors.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No pending applications</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            There are no vendor applications awaiting review at the moment.
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
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">CAC Number</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {vendors.map((vendor) => (
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
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{vendor.contactPhone || "--"}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{vendor.cacRegistrationNumber || "--"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAction(vendor, "approve")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => openAction(vendor, "suspend")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                            Suspend
                          </button>
                          <button
                            onClick={() => openAction(vendor, "reject")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.vendorProfileId}
                className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-4 transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <Store className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{vendor.businessName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{vendor.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Phone</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate">{vendor.contactPhone || "--"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">CAC Number</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate">{vendor.cacRegistrationNumber || "--"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openAction(vendor, "approve")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => openAction(vendor, "suspend")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all"
                  >
                    <Ban className="w-4 h-4" />
                    Suspend
                  </button>
                  <button
                    onClick={() => openAction(vendor, "reject")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
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
