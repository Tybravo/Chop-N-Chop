"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, LogIn, Loader2 } from "lucide-react";

function ApplicationPendingContent() {
  const searchParams = useSearchParams();
  const businessName = searchParams.get("businessName") || "your business";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#26292C] rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Application Submitted Successfully!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Thank you for applying to become a vendor with <span className="font-semibold text-[#FC6B31]">Chop n&apos; Chop</span>.
        </p>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your application for <span className="font-semibold text-gray-900 dark:text-white">{businessName}</span> is currently <span className="font-semibold text-orange-600">pending approval</span> from our administrators.
        </p>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-lg p-4 mb-8 text-sm text-left">
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            What happens next?
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="text-[#FC6B31] font-bold">•</span>
              <span>Our team will review your application</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FC6B31] font-bold">•</span>
              <span>Once approved, you will receive access to your vendor dashboard</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FC6B31] font-bold">•</span>
              <span>You can then log in and start managing your meals and orders</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          <Link
            href="/vendor/login"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e55a20] transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Vendor Login
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@chopnchop.com" className="text-[#FC6B31] hover:underline">
            support@chopnchop.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ApplicationPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />
      </div>
    }>
      <ApplicationPendingContent />
    </Suspense>
  );
}
