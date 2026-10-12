"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/vendor/auth.service";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { VendorProfile } from "@/types/vendor";
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";

function VendorResetPinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useVendorAuth();

  const email = searchParams.get("email") || "";

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // PIN States
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // PIN Visibility States
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/vendor/login");
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle pasting multiple digits
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty box or the last box
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single digit
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;

    setError("");
    setSuccessMsg("");
    setResending(true);

    try {
      await authService.initiateRecovery({ email });
      setSuccessMsg("Code resent successfully! Check your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend code.");
      }
    } finally {
      setResending(false);
    }
  };

  // Build a minimal VendorProfile from the reset response so we can auto-login
  // the vendor without requiring a separate login call.
  const buildVendorProfile = (res: { user_id?: string; profilePictureUrl?: string }): VendorProfile => ({
    id: res.user_id || email,
    businessName: "",
    ownerName: "",
    email,
    phone: "",
    businessAddress: "",
    businessCategory: "",
    businessDescription: "",
    logoUrl: res.profilePictureUrl,
    vendorStatus: "PENDING",
    kycStatus: "NOT_SUBMITTED",
    kycCompleted: false,
    isStoreOnline: false,
    joinedAt: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("New PINs do not match.");
      return;
    }

    if (newPin.length < 4) {
      setError("New PIN must be at least 4 digits.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPin({
        email,
        otp: fullOtp,
        newPin,
        confirmPin,
      });

      const accessToken = res.access_token || res.data?.access_token;
      const refreshToken = res.refresh_token || res.data?.refresh_token;
      const userId = res.user_id || res.data?.user_id;

      // Save tokens so subsequent API calls are authenticated.
      if (accessToken && typeof window !== "undefined") {
        localStorage.setItem("vendor_access_token", accessToken);
        if (refreshToken) localStorage.setItem("vendor_refresh_token", refreshToken);
      }

      // Auto login the vendor. login() handles the push to their dashboard.
      login(buildVendorProfile({ user_id: userId, profilePictureUrl: res.profilePictureUrl }), accessToken || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during PIN reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="admin-card max-w-md w-full p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="mb-6">
          <Link
            href="/vendor/login"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#FC6B31] dark:text-gray-400 dark:hover:text-[#FC6B31] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verify & Reset
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            We sent a code to your email. Enter it below to create a new PIN.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm flex justify-between items-center">
            <span>{successMsg}</span>
            <button type="button" onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6-digit OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              6-Digit Recovery Code
            </label>
            <div className="flex justify-center gap-2 items-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type={showOtp ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                />
              ))}
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="ml-2 flex items-center text-gray-400 hover:text-[#FC6B31] transition-colors focus:outline-none"
              >
                {showOtp ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800 my-6" />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New 4-Digit PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNewPin ? "text" : "password"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors tracking-widest"
                placeholder="••••"
                maxLength={4}
                inputMode="numeric"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                {showNewPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors tracking-widest"
                placeholder="••••"
                maxLength={4}
                inputMode="numeric"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC6B31] hover:bg-[#e35014] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6B31] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Reset & Login"
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-medium text-gray-500 hover:text-[#FC6B31] transition-colors disabled:opacity-50"
            >
              {resending ? "Sending..." : "Didn't receive a code? Resend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorResetPinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    }>
      <VendorResetPinContent />
    </Suspense>
  );
}