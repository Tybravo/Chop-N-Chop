"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/admin/auth.service";
import { Loader2, KeyRound, X, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { LoginResponse } from "@/types/admin";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { login } = useAdminAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  
  // Resend OTP State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/admin/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0 || isResending) return;
    
    setIsResending(true);
    setResendMessage("");
    setError("");

    try {
      // Decode the URL-encoded email parameter to ensure it's a valid email string
      const decodedEmail = decodeURIComponent(email!);
      await authService.resendOtp(decodedEmail);
      
      setResendMessage("A new OTP has been sent to your email.");
      setTimeLeft(300); // Reset timer back to 5 minutes
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP.");
      }
    } finally {
      setIsResending(false);
    }
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
      document.getElementById(`admin-otp-${nextIndex}`)?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`admin-otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`admin-otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (!otpValue || otpValue.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyOtp({ email: email!, otp: otpValue }) as unknown as LoginResponse;
      
      // OTP is successful, tokens received.
      if (res.access_token) {
        localStorage.setItem("admin_access_token", res.access_token);
        localStorage.setItem("admin_refresh_token", res.refresh_token);
        
        login({
          id: res.user_id,
          name: "Admin User", 
          email: email!,
          role: (res.role as "SUPER_ADMIN" | "SUB_ADMIN") || "SUPER_ADMIN",
          status: (res.status as "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED") || "ACTIVE",
          avatarUrl: res.profilePictureUrl && res.profilePictureUrl.trim() !== "" ? res.profilePictureUrl : undefined,
          createdAt: new Date().toISOString(),
        });
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
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none ml-2" aria-label="Dismiss error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {resendMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm flex justify-between items-center">
            <span>{resendMessage}</span>
            <button type="button" onClick={() => setResendMessage("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none ml-2" aria-label="Dismiss message">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              OTP Code
            </label>
            <div className="flex justify-center gap-2 items-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`admin-otp-${idx}`}
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
            <p className="text-xs text-gray-400 mt-2 text-center">
              Hint: Use &quot;123456&quot; for mock login
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC6B31] hover:bg-[#e35014] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6B31] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {timeLeft > 0 ? (
              <p>Resend OTP in <span className="font-medium text-[#FC6B31]">{formatTime(timeLeft)}</span></p>
            ) : (
              <p>
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-semibold text-[#FC6B31] hover:text-[#e35014] transition-colors disabled:opacity-70"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </p>
            )}
          </div>
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
