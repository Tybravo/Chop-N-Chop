import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, X, ShieldCheck, AlertCircle, FileX, RefreshCw } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";

interface KycDetailsModalProps {
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

// Check if the KYC payload is effectively empty (no KYC detail exists)
function isEmptyKyc(data: Record<string, unknown>): boolean {
  if (!data || Object.keys(data).length === 0) return true;
  // If all values are null/undefined/empty, treat as no KYC detail
  return Object.values(data).every(
    (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
  );
}

export function KycDetailsModal({ vendorId, businessName, isOpen, onClose }: KycDetailsModalProps) {
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noKyc, setNoKyc] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isOpen || !vendorId) return;

    let cancelled = false;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      setDetails(null);
      setNoKyc(false);
      try {
        const data = await vendorService.getVendorKyc(vendorId);
        if (!cancelled) {
          if (isEmptyKyc(data)) {
            setNoKyc(true);
          } else {
            setDetails(data);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          // If the endpoint returns 404, it means no KYC record exists for this vendor
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setNoKyc(true);
          } else {
            // Show a friendly message instead of the raw backend error
            let message = "The server encountered an error while loading this vendor's KYC details. Please try again later.";
            if (axios.isAxiosError(err)) {
              const status = err.response?.status;
              if (status === 401 || status === 403) {
                message = "Your session may have expired. Please refresh the page and try again.";
              } else if (status === 500) {
                message = "The server encountered an error while loading this vendor's KYC details. Please try again later.";
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
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [isOpen, vendorId, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (!isOpen) return null;

  const entries = details ? Object.entries(details) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">KYC Details</h2>
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
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading KYC details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-sm text-red-600 dark:text-red-400 mb-4 max-w-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : noKyc ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-black/30 rounded-full flex items-center justify-center mb-4">
                <FileX className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No KYC Details Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                This vendor does not have any KYC (Know Your Customer) records submitted yet. KYC
                details will appear here once the vendor submits their verification documents.
              </p>
            </div>
          ) : details && entries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entries.map(([key, value]) => {
                const isNull = value === null || value === undefined || value === "";
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
                    <p
                      className={`text-sm font-semibold break-words ${
                        isNull
                          ? "text-gray-400 dark:text-gray-500 italic"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {formatValue(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No KYC details available for this vendor.
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