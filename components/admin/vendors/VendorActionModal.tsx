import { useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Ban } from "lucide-react";
import { PendingVendorApplication } from "@/types/vendor";
import { vendorService } from "@/services/admin/vendor.service";

type ActionType = "approve" | "suspend" | "reject";

interface VendorActionModalProps {
  vendor: PendingVendorApplication;
  action: ActionType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vendorId: string, action: ActionType) => void;
}

const ACTION_CONFIG = {
  approve: {
    title: "Approve Vendor Application",
    description: "This will approve the vendor, enable their login, and initialize their wallet.",
    icon: CheckCircle,
    iconBg: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-500",
    buttonBg: "bg-green-600 hover:bg-green-700",
    buttonText: "Yes, Approve",
  },
  suspend: {
    title: "Suspend Vendor",
    description: "This will temporarily lock the vendor out of their account and prevent them from managing inventory.",
    icon: Ban,
    iconBg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500",
    buttonBg: "bg-orange-600 hover:bg-orange-700",
    buttonText: "Yes, Suspend",
  },
  reject: {
    title: "Reject Vendor Application",
    description: "This will decline the application and keep the user locked out.",
    icon: XCircle,
    iconBg: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-500",
    buttonBg: "bg-red-600 hover:bg-red-700",
    buttonText: "Yes, Reject",
  },
};

export function VendorActionModal({ vendor, action, isOpen, onClose, onSuccess }: VendorActionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  const handleAction = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (action === "approve") {
        await vendorService.approveVendor(vendor.vendorProfileId);
      } else if (action === "suspend") {
        await vendorService.suspendVendor(vendor.vendorProfileId);
      } else if (action === "reject") {
        await vendorService.rejectVendor(vendor.vendorProfileId);
      }
      onSuccess(vendor.vendorProfileId, action);
    } catch (err: unknown) {
      let message = `Unable to ${action} vendor. Please try again.`;
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const backendMessage = err.response?.data?.message || err.response?.data?.error;
        if (status === 403) {
          message = "You do not have permission to perform this action.";
        } else if (status === 404) {
          message = "This vendor application could not be found. It may have already been processed.";
        } else if (typeof backendMessage === "string" && backendMessage) {
          message = backendMessage;
        }
      }
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 text-center pt-8">
          <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm px-4 mb-2">
            {config.description}
          </p>
          <p className="text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{vendor.businessName}</span>
            <span className="text-gray-400 dark:text-gray-500"> ({vendor.email})</span>
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col-reverse sm:flex-row gap-3 justify-center bg-gray-50/50 dark:bg-black/20">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleAction}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white ${config.buttonBg} transition-colors disabled:opacity-70 flex items-center justify-center gap-2`}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isProcessing ? "Processing..." : config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
