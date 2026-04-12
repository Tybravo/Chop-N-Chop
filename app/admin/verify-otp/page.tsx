"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminService } from "@/lib/api/admin.service";
import { Loader2, KeyRound } from "lucide-react";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/admin/login");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await adminService.verifyOtp({ email: email!, otp });
      if (res.success) {
        // In a real app, we would store the token in cookies/localStorage here
        // For this task, we redirect to the dashboard
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid OTP code.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-[#fd8b5d] dark:border-[#e35014] transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-orange dark:hover:shadow-[0_0_25px_rgba(252,107,49,0.6)]">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verify Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            We sent an OTP code to <br />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {email}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="block w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              placeholder="------"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Hint: Use &quot;123456&quot; for mock login
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC6B31] hover:bg-[#e35014] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6B31] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
