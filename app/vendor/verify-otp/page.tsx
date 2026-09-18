"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/vendor/auth.service";
import { Loader2, X, Eye, EyeOff } from "lucide-react";

// Define the shape of our toast notification state
interface ToastNotification {
  show: boolean;
  type: "success" | "error";
  message: string;
}

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes = 600 seconds
  const [toast, setToast] = useState<ToastNotification>({
    show: false,
    type: "success",
    message: "",
  });

  // Timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  // Format countdown
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    
    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    
    if (otpValue.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      // Verify OTP but do NOT log the user into a session.
      // After a successful application, the vendor must wait for admin approval.
      await authService.verifyOtp(email, otpValue);
      const businessName = searchParams.get("businessName") || "";
      router.push(`/vendor/application-pending?businessName=${encodeURIComponent(businessName)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid OTP or expired");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return; // Prevent resend if timer is active
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      setToast({
        show: true,
        type: "success",
        message: "A new OTP has been sent to your email.",
      });
      setCountdown(600); // Reset timer to 10 minutes
    } catch (err: unknown) {
      setToast({
        show: true,
        type: "error",
        message: err instanceof Error ? err.message : "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="admin-card max-w-md w-full p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verify OTP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="text-red-600 ml-2 focus:outline-none">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {toast.show && (
          <div className={`mb-6 p-4 border rounded-lg text-sm flex justify-between items-center ${
            toast.type === "success" 
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400" 
              : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 focus:outline-none">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 items-center">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type={showOtp ? "text" : "password"}
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                maxLength={6}
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

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC6B31] hover:bg-[#e35014] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6B31] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend OTP in <span className="font-medium text-[#FC6B31]">{formatTime(countdown)}</span>
            </p>
          ) : (
            <button 
              type="button" 
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm font-medium text-[#FC6B31] hover:text-[#e35014] disabled:opacity-50 flex items-center justify-center w-full"
            >
              {isResending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorVerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" /></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
