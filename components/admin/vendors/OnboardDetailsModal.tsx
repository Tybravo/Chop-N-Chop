import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loader2, X, Store, AlertCircle, RefreshCw } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";

interface OnboardDetailsModalProps {
  vendorId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Format a value for display, showing null/undefined/empty as "Not provided"
function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// Humanize a snake_case / camelCase key for display
function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// Check if a value is effectively empty (null/undefined/empty string/empty object)
function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "object" && Object.keys(value as object).length === 0) return true;
  return false;
}

// Render a single field value
function FieldValue({ value }: { value: unknown }) {
  const isNull = isEmptyValue(value);
  return (
    <p
      className={`text-sm font-semibold break-words ${
        isNull ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-900 dark:text-white"
      }`}
    >
      {formatValue(value)}
    </p>
  );
}

// Render a section of fields (e.g. account, onboarding, kyc, banking, store)
function Section({ title, data }: { title: string; data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        {humanizeKey(title)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entries.map(([key, value]) => {
          const isNull = isEmptyValue(value);
          return (
            <div
              key={key}
              className={`p-3 rounded-lg border ${
                isNull
                  ? "bg-gray-50 dark:bg-black/30 border-gray-100 dark:border-gray-800"
                  : "bg-white dark:bg-[#26292C] border-gray-100 dark:border-gray-800"
              }`}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                {humanizeKey(key)}
              </p>
              <FieldValue value={value} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OnboardDetailsModal({ vendorId, businessName, isOpen, onClose }: OnboardDetailsModalProps) {
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadDetails = useCallback(async () => {
    if (!isOpen || !vendorId) return;

    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const data = await vendorService.getVendorById(vendorId);
      setDetails(data);
    } catch (err: unknown) {
      // Show a friendly message instead of the raw backend error.
      // Only fall back to the raw error message if we can't determine
      // a user-friendly contextual message.
      let message = "The server encountered an error while loading this vendor's details. Please try again later.";
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 404) {
          message = "Vendor details not found. This vendor may no longer exist.";
        } else if (status === 401 || status === 403) {
          message = "Your session may have expired. Please refresh the page and try again.";
        } else if (status === 500) {
          message = "The server encountered an error while loading this vendor's details. Please try again later.";
        } else if (err.code === "ECONNABORTED") {
          message = "The request timed out. Please check your connection and try again.";
        } else if (!err.response) {
          message = "Unable to reach the server. Please check your connection and try again.";
        }
      } else if (err instanceof Error) {
        // Only use the raw message if it's not a generic "Internal Server Error"
        if (err.message && err.message !== "Internal Server Error" && !err.message.toLowerCase().includes("500")) {
          message = err.message || message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isOpen, vendorId]);

  useEffect(() => {
    if (isOpen && vendorId) {
      loadDetails();
    }
  }, [isOpen, vendorId, retryCount, loadDetails]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (!isOpen) return null;

  // Extract top-level scalar fields (e.g. vendorId) and nested sections
  const scalarEntries = details
    ? Object.entries(details).filter(([, v]) => typeof v !== "object" || v === null)
    : [];
  const sectionEntries = details
    ? Object.entries(details).filter(
        ([, v]) => typeof v === "object" && v !== null && !Array.isArray(v)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
              <Store className="w-6 h-6 text-[#FC6B31]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Onboard Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{businessName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31] mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading vendor details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-sm text-red-600 dark:text-red-400 mb-4 max-w-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#FC6B31] hover:bg-[#e55a20] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : details && (scalarEntries.length > 0 || sectionEntries.length > 0) ? (
            <>
              {/* Top-level scalar fields */}
              {scalarEntries.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {scalarEntries.map(([key, value]) => {
                    const isNull = isEmptyValue(value);
                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border ${
                          isNull
                            ? "bg-gray-50 dark:bg-black/30 border-gray-100 dark:border-gray-800"
                            : "bg-white dark:bg-[#26292C] border-gray-100 dark:border-gray-800"
                        }`}
                      >
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                          {humanizeKey(key)}
                        </p>
                        <FieldValue value={value} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Nested sections */}
              {sectionEntries.map(([key, value]) => (
                <Section key={key} title={key} data={value as Record<string, unknown>} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No vendor details available for this vendor.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}