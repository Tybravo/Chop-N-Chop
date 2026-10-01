"use client";

import { useVendorAuth } from "@/context/VendorAuthContext";
import { AlertCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export function VendorBanner() {
  const { user } = useVendorAuth();

  if (!user) return null;

  const vendorEmail = user.email.replace(/[@.]/g, "_");

  // UNVERIFIED: State A
  if (user.status === "UNVERIFIED") {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">You are on a provisional account.</span> Withdrawals are locked.
            </p>
          </div>
          <Link
            href={`/vendor/${vendorEmail}/kyc`}
            className="shrink-0 text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center bg-yellow-100 dark:bg-yellow-800/50 px-3 py-1.5 rounded-full transition-colors self-end sm:self-auto"
          >
            Complete Profile <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  // PENDING: State B
  if (user.status === "PENDING") {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 px-4 py-3 sm:px-6">
        <div className="flex items-start sm:items-center gap-3 max-w-7xl mx-auto w-full">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Your documents are under review.</span> Your store is currently paused.
          </p>
        </div>
      </div>
    );
  }

  // APPROVED: State C (no banner)
  return null;
}
