import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loader2, X, Store, AlertCircle, RefreshCw } from "lucide-react";
import { vendorService } from "@/services/admin/vendor.service";
import { SafeAvatar } from "@/components/SafeAvatar";

interface OnboardDetailsModalProps {
  vendorId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Recursively search the payload (any depth) for the first non-empty value
// whose key matches one of the given aliases (case-insensitive).
function deepFind(root: unknown, keys: string[]): unknown {
  const aliases = new Set(keys.map((k) => k.toLowerCase()));
  const found: unknown[] = [];

  const walk = (node: unknown) => {
    if (found.length > 0) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object") {
      const obj = node as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        if (aliases.has(key.toLowerCase())) {
          const v = obj[key];
          if (v !== null && v !== undefined && v !== "") {
            found.push(v);
            return;
          }
        }
      }
      for (const key of Object.keys(obj)) {
        walk(obj[key]);
        if (found.length > 0) return;
      }
    }
  };

  walk(root);
  return found.length > 0 ? found[0] : undefined;
}

// Format a raw value for display: booleans -> Yes/No, dates -> readable, others as-is.
function formatDisplayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}(T| )/.test(str) || /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const date = new Date(str);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
  }
  return str;
}

interface FieldDef {
  label: string;
  aliases: string[];
}

const ACCOUNT_FIELDS: FieldDef[] = [
  { label: "Email", aliases: ["email"] },
  { label: "Phone", aliases: ["phone", "contactPhone", "contact_phone"] },
  { label: "Status", aliases: ["status"] },
  {
    label: "Created At",
    aliases: ["createdAt", "created_at", "joinedAt", "joined_at", "registrationDate"],
  },
];

const ONBOARDING_FIELDS: FieldDef[] = [
  { label: "Owner Name", aliases: ["ownerName", "owner_name"] },
  { label: "Business Name", aliases: ["businessName", "business_name"] },
  { label: "Contact Phone", aliases: ["contactPhone", "contact_phone", "phone"] },
  {
    label: "Profile Picture Url",
    aliases: ["profilePictureUrl", "profile_picture_url", "logoUrl", "logo_url", "avatar", "image"],
  },
  {
    label: "Business Description",
    aliases: ["businessDescription", "business_description", "description"],
  },
  { label: "Business Category", aliases: ["businessCategory", "business_category", "category"] },
  { label: "Kitchen Location", aliases: ["kitchenLocation", "kitchen_location", "location", "address"] },
  {
    label: "Kitchen Coordinates",
    aliases: ["kitchenCoordinates", "kitchen_coordinates", "coordinates", "coordinate"],
  },
];

// Render one field as a labelled card, mirroring the modal's existing card styling.
function FieldCard({ label, value }: { label: string; value: unknown }) {
  const display = formatDisplayValue(value);
  const isMissing = display === "Not provided";
  return (
    <div
      className={`p-3 rounded-lg border ${
        isMissing
          ? "bg-gray-50 dark:bg-black/30 border-gray-100 dark:border-gray-800"
          : "bg-white dark:bg-[#26292C] border-gray-100 dark:border-gray-800"
      }`}
    >
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-sm font-semibold break-words ${
          isMissing ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-900 dark:text-white"
        }`}
      >
        {display}
      </p>
    </div>
  );
}

// Render a titled group of fields.
function Section({ title, fields, data }: { title: string; fields: FieldDef[]; data: Record<string, unknown> }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <FieldCard key={field.label} label={field.label} value={deepFind(data, field.aliases)} />
        ))}
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

  const profilePicture = details
    ? (deepFind(details, [
        "profilePictureUrl",
        "profile_picture_url",
        "logoUrl",
        "logo_url",
        "avatar",
        "image",
      ]) as string | undefined)
    : undefined;

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
          ) : details ? (
            <>
              {/* Vendor profile picture, centered at the top */}
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100 dark:border-orange-900/30 bg-gray-100 dark:bg-black/30">
                  {profilePicture ? (
                    <SafeAvatar
                      src={profilePicture}
                      alt={`${businessName} profile picture`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              <Section title="Account" fields={ACCOUNT_FIELDS} data={details} />
              <Section title="Onboarding" fields={ONBOARDING_FIELDS} data={details} />
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