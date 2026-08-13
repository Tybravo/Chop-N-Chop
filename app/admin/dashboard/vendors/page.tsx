"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Store, CheckCircle, XCircle, Ban, ShieldCheck, RefreshCw, Filter } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";
import { PendingVendorApplication } from "@/types/vendor";
import { VendorActionModal } from "@/components/admin/vendors/VendorActionModal";

type ActionType = "approve" | "reject" | "suspend" | "verify";

// Onboard filter statuses (excluding UNVERIFIED which moves to KYC)
type OnboardFilterStatus = "ALL" | "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
// KYC filter statuses
type KycFilterStatus = "VERIFIED" | "UNVERIFIED";

// Combined status for the badge display
type DisplayFilterStatus = OnboardFilterStatus | KycFilterStatus;

const STATUS_BADGE_STYLES: Record<DisplayFilterStatus, string> = {
  ALL: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400",
  PENDING: "bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-400",
  APPROVED: "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400",
  SUSPENDED: "bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400",
  REJECTED: "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400",
  UNVERIFIED: "bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-400",
  VERIFIED: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400",
};

const FILTER_LABELS: Record<DisplayFilterStatus, string> = {
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
  UNVERIFIED: "Unverified",
  VERIFIED: "Verified",
};

// Onboard filter options
const ONBOARD_FILTER_OPTIONS: { value: OnboardFilterStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REJECTED", label: "Rejected" },
];

// KYC filter options
const KYC_FILTER_OPTIONS: { value: KycFilterStatus; label: string }[] = [
  { value: "VERIFIED", label: "Verified" },
  { value: "UNVERIFIED", label: "Unverified" },
];

// 3D embossed button styles
const ACTION_BUTTON_STYLES = {
  approve:
    "w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 border-b-4 border-green-800 shadow-md hover:bg-green-500 hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
  reject:
    "w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
  suspend:
    "w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-yellow-500 border-b-4 border-yellow-700 shadow-md hover:bg-yellow-400 hover:border-yellow-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
  verify:
    "w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150",
};

// Map KYC filter values to vendor status for filtering
// VERIFIED -> APPROVED status, UNVERIFIED -> UNVERIFIED status
const KYC_STATUS_MAP: Record<KycFilterStatus, PendingVendorApplication["status"]> = {
  VERIFIED: "APPROVED",
  UNVERIFIED: "UNVERIFIED",
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<PendingVendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dual filter states
  const [onboardFilter, setOnboardFilter] = useState<OnboardFilterStatus>("ALL");

  // Track which filter box is currently active (for data fetching and UI)
  const [activeFilterSection, setActiveFilterSection] = useState<"onboard" | "kyc">("onboard");
  const [activeKycStatus, setActiveKycStatus] = useState<KycFilterStatus | null>(null);

  const [selectedVendor, setSelectedVendor] = useState<PendingVendorApplication | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  // Determine the effective filter for fetching/display
  const effectiveFilter: DisplayFilterStatus =
    activeFilterSection === "kyc" && activeKycStatus
      ? activeKycStatus
      : onboardFilter;

  const fetchVendors = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      // Always fetch all vendors, then filter client-side for both filter boxes
      const data = await vendorService.getAllVendors();
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
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Apply client-side filtering based on active filter section
  const filteredVendors = useMemo(() => {
    if (activeFilterSection === "kyc" && activeKycStatus) {
      // KYC filters map to actual vendor statuses
      const targetStatus = KYC_STATUS_MAP[activeKycStatus];
      return vendors.filter((v) => v.status === targetStatus);
    }

    // Onboard filters
    if (onboardFilter === "ALL") return vendors;

    // Approved includes both APPROVED and UNVERIFIED vendors
    // (UNVERIFIED vendors are approved/onboarded, just awaiting KYC verification)
    if (onboardFilter === "APPROVED") {
      return vendors.filter(
        (v) => v.status === "APPROVED" || v.status === "UNVERIFIED"
      );
    }

    return vendors.filter((v) => v.status === onboardFilter);
  }, [vendors, onboardFilter, activeFilterSection, activeKycStatus]);

  // Handle selecting a KYC filter option
  const handleKycFilterSelect = (status: KycFilterStatus) => {
    setActiveFilterSection("kyc");
    setActiveKycStatus(status);
  };

  // Handle selecting an Onboard filter option
  const handleOnboardFilterSelect = (status: OnboardFilterStatus) => {
    setActiveFilterSection("onboard");
    setOnboardFilter(status);
    // Clear any active KYC selection
    setActiveKycStatus(null);
  };

  // Clear all filters (reset to default Onboard ALL)
  const clearAllFilters = () => {
    handleOnboardFilterSelect("ALL");
  };

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
      action === "approve" || action === "verify"
        ? "APPROVED"
        : action === "suspend"
          ? "SUSPENDED"
          : action === "reject" && activeFilterSection === "kyc" && activeKycStatus === "UNVERIFIED"
            ? "UNVERIFIED"
            : "REJECTED";

    // Update the vendor in the master list optimistically
    setVendors((prev) =>
      prev.map((v) => (v.vendorProfileId === vendorId ? { ...v, status: newStatus } : v))
    );
    closeAction();

    // Silent refresh: re-fetch all vendors from the server to ensure
    // all status tables reflect the actual server state in real-time.
    // This runs in the background without showing loading skeletons.
    fetchVendors(true);
  };

  // Determine which action buttons to show based on active filter section and status
  const getActionButtons = (vendor: PendingVendorApplication) => {
    // KYC section: Unverified shows Verify + Reject buttons
    if (activeFilterSection === "kyc" && activeKycStatus === "UNVERIFIED") {
      return (
        <>
          <button
            onClick={() => openAction(vendor, "verify")}
            className={ACTION_BUTTON_STYLES.verify}
          >
            <ShieldCheck className="w-4 h-4" />
            Verify
          </button>
          <button
            onClick={() => openAction(vendor, "reject")}
            className={ACTION_BUTTON_STYLES.reject}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </>
      );
    }

    // KYC section: Verified shows Suspend button
    if (activeFilterSection === "kyc" && activeKycStatus === "VERIFIED") {
      return (
        <button
          onClick={() => openAction(vendor, "suspend")}
          className={ACTION_BUTTON_STYLES.suspend}
        >
          <Ban className="w-4 h-4" />
          Suspend
        </button>
      );
    }

    // Onboard section: Approved shows Suspend button
    if (activeFilterSection === "onboard" && onboardFilter === "APPROVED") {
      return (
        <button
          onClick={() => openAction(vendor, "suspend")}
          className={ACTION_BUTTON_STYLES.suspend}
        >
          <Ban className="w-4 h-4" />
          Suspend
        </button>
      );
    }

    // Onboard section: Suspended or Rejected shows Approve button
    if (
      activeFilterSection === "onboard" &&
      (onboardFilter === "SUSPENDED" || onboardFilter === "REJECTED")
    ) {
      return (
        <button
          onClick={() => openAction(vendor, "approve")}
          className={ACTION_BUTTON_STYLES.approve}
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
      );
    }

    // Onboard section: Pending shows Approve + Reject buttons
    if (activeFilterSection === "onboard" && onboardFilter === "PENDING") {
      return (
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
      );
    }

    // Onboard ALL: show no action buttons (read-only table)
    return null;
  };

  // Determine if actions column should be shown
  const showActionsColumn = () => {
    if (activeFilterSection === "onboard" && onboardFilter === "ALL") return false;
    return true;
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-4 h-24" />
      ))}
    </div>
  );

  const getEmptyStateMessage = () => {
    if (activeFilterSection === "onboard" && onboardFilter === "ALL") {
      return "There are no vendor applications at the moment.";
    }
    const label = effectiveFilter;
    return `There are no ${FILTER_LABELS[label].toLowerCase()} vendor applications at the moment.`;
  };

  const getActiveFilterLabel = () => {
    if (activeFilterSection === "kyc" && activeKycStatus) {
      return `KYC: ${FILTER_LABELS[activeKycStatus]}`;
    }
    return FILTER_LABELS[onboardFilter];
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
                {filteredVendors.length} {getActiveFilterLabel()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review, approve, suspend, or reject vendor applications.
          </p>
        </div>

        <button
          onClick={() => fetchVendors()}
          disabled={loading}
          className="hidden md:flex items-center gap-2 bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Dual Filter Box - Onboard and KYC */}
      <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Filters</span>
          </div>
          {(onboardFilter !== "ALL" || (activeKycStatus !== null && activeKycStatus !== undefined)) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#FC6B31] hover:underline ml-auto sm:ml-0"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Desktop: Two side-by-side filter boxes */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-4">
          {/* Onboard Filter Box */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Onboard
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700">
              {ONBOARD_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOnboardFilterSelect(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    activeFilterSection === "onboard" && onboardFilter === option.value
                      ? "bg-[#FC6B31] text-white shadow-md"
                      : "bg-white dark:bg-[#26292C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* KYC Filter Box */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              KYC
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700">
              {KYC_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleKycFilterSelect(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    activeFilterSection === "kyc" && activeKycStatus === option.value
                      ? "bg-[#FC6B31] text-white shadow-md"
                      : "bg-white dark:bg-[#26292C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked filter boxes */}
        <div className="sm:hidden space-y-4">
          {/* Onboard Filter Box */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Onboard
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700">
              {ONBOARD_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOnboardFilterSelect(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    activeFilterSection === "onboard" && onboardFilter === option.value
                      ? "bg-[#FC6B31] text-white shadow-md"
                      : "bg-white dark:bg-[#26292C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* KYC Filter Box */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              KYC
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700">
              {KYC_FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleKycFilterSelect(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    activeFilterSection === "kyc" && activeKycStatus === option.value
                      ? "bg-[#FC6B31] text-white shadow-md"
                      : "bg-white dark:bg-[#26292C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => fetchVendors()}
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
            {activeFilterSection === "onboard" && onboardFilter === "ALL"
              ? "No vendor applications"
              : `No ${FILTER_LABELS[effectiveFilter].toLowerCase()} vendors`}
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
                    {showActionsColumn() && (
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
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE_STYLES[vendor.status as DisplayFilterStatus]}`}
                        >
                          {vendor.status.charAt(0) + vendor.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      {showActionsColumn() && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {getActionButtons(vendor)}
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
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_BADGE_STYLES[vendor.status as DisplayFilterStatus]}`}
                  >
                    {vendor.status.charAt(0) + vendor.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {showActionsColumn() && (
                  <div className="flex flex-col gap-2">
                    {getActionButtons(vendor)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile Refresh FAB */}
      <button
        onClick={() => fetchVendors()}
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
