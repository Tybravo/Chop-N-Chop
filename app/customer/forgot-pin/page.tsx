"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function ForgotPinPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otpValues.join("");
    if (otpString.length !== 6) {
      alert("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleSetNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      alert("Your new PIN must be exactly 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      alert("PINs do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1200);
  };

  const handleNewPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4));
  };
  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4));
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1); 
    setOtpValues(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otpValues];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpValues(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FFFBF7] flex items-center justify-center p-4 lg:p-8 overflow-hidden selection:bg-[#FC6B31] selection:text-white animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <div className="w-full max-w-5xl h-full lg:h-auto lg:max-h-[720px] bg-white rounded-[28px] lg:rounded-[40px] shadow-sm lg:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row border border-orange-100/60 overflow-hidden relative">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 px-6 py-6 lg:p-12 flex flex-col h-full justify-between overflow-hidden">
          
          {/* Top Back Navigation */}
          <div className="flex items-center justify-between shrink-0">
            {step === 1 ? (
              <Link href="/customer/login" className="inline-flex p-2 -ml-2 text-gray-500 hover:text-[#FC6B31] transition-colors" aria-label="Back to Log in">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            ) : (
              <button onClick={() => { setStep(1); setOtpValues(Array(6).fill("")); }} className="inline-flex p-2 -ml-2 text-gray-500 hover:text-[#FC6B31] transition-colors" aria-label="Start Over">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Centered Content Wrapper */}
          <div className="w-full flex-1 flex flex-col justify-center max-w-sm mx-auto shrink-0 animate-in fade-in slide-in-from-right-4 duration-300 py-1 space-y-2">

            {/* ==========================================
                STEP 1: INITIATION (Email Request)
            ========================================== */}
            {step === 1 && (
              <div className="w-full flex flex-col items-center space-y-2">
                {/* Header Title (35px) */}
                <div className="text-center shrink-0 w-full">
                  <h2 className="font-black text-gray-900 tracking-tight text-[35px] leading-tight">Forgot PIN?</h2>
                </div>

                <div className="flex min-h-[130px] max-h-[170px] w-full justify-center items-center overflow-hidden shrink-0 my-1">
                  <img src="/woman_eating.png" alt="Enjoying ChopnChop" className="max-h-full w-auto max-w-[280px] object-contain drop-shadow-md" />
                </div>

                {/* Subtitle (16px) */}
                <p className="text-gray-500 font-medium text-center px-2 text-[16px]">
                  Enter your registered email address to receive a verification code.
                </p>

                <form className="space-y-3.5 shrink-0 w-full pt-1" onSubmit={handleRequestReset}>
                  <div className="relative shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address" 
                      className="w-full pl-[48px] pr-4 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#FC6B31] text-white py-3.5 rounded-[18px] lg:rounded-[20px] font-extrabold text-[15px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-70 shrink-0"
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Sending...</> : "Send Verification Code"}
                  </button>
                </form>
              </div>
            )}

            {/* ==========================================
                STEP 2: OTP VERIFICATION
            ========================================== */}
            {step === 2 && (
              <div className="w-full flex flex-col items-center space-y-2">
                {/* Header Title (35px) */}
                <div className="text-center shrink-0 w-full">
                  <h2 className="font-black text-gray-900 tracking-tight text-[35px] leading-tight">Check your email</h2>
                </div>

                <div className="flex min-h-[120px] max-h-[160px] w-full justify-center items-center overflow-hidden shrink-0 my-1">
                  <img src="/woman_eating.png" alt="Enjoying ChopnChop" className="max-h-full w-auto max-w-[260px] object-contain drop-shadow-md" />
                </div>

                {/* Subtitle (16px) */}
                <p className="text-gray-500 font-medium text-center text-[16px]">
                  We sent a 6-digit code to <span className="font-bold text-gray-900">{email}</span>
                </p>

                <form className="space-y-4 shrink-0 w-full pt-1" onSubmit={handleVerifyOtp}>
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 w-full max-w-[340px] mx-auto px-1 sm:px-0">
                    {otpValues.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-[42px] h-[52px] sm:w-[48px] sm:h-[56px] flex-shrink-0 bg-white border border-gray-200 rounded-[14px] lg:rounded-[16px] text-center text-lg sm:text-xl font-bold text-gray-900 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#FC6B31] text-white py-3.5 rounded-[18px] lg:rounded-[20px] font-extrabold text-[15px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-70 shrink-0"
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Verifying...</> : "Verify Code"}
                  </button>
                </form>
                <div className="text-center shrink-0 w-full pt-1">
                  <button onClick={() => setStep(1)} className="text-[13px] font-bold text-[#FC6B31] hover:underline">
                    Didn&apos;t receive the email? Resend code
                  </button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 3: NEW PIN SETUP
            ========================================== */}
            {step === 3 && (
              <div className="w-full flex flex-col items-center space-y-2">
                {/* Header Title (35px) */}
                <div className="text-center shrink-0 w-full">
                  <h2 className="font-black text-gray-900 tracking-tight text-[35px] leading-tight">Create New PIN</h2>
                </div>

                <div className="flex min-h-[110px] max-h-[150px] w-full justify-center items-center overflow-hidden shrink-0 my-1">
                  <img src="/woman_eating.png" alt="Enjoying ChopnChop" className="max-h-full w-auto max-w-[250px] object-contain drop-shadow-md" />
                </div>

                {/* Subtitle (16px) */}
                <p className="text-gray-500 font-medium text-center text-[16px]">
                  Enter your new 4-digit security PIN.
                </p>

                <form className="space-y-3 shrink-0 w-full pt-1" onSubmit={handleSetNewPin}>
                  <div className="relative shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type={showNewPin ? "text" : "password"}
                      inputMode="numeric" pattern="\d{4}" maxLength={4}
                      value={newPin} onChange={handleNewPinChange}
                      placeholder="New 4-Digit PIN" 
                      className="w-full pl-[48px] pr-12 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[14px] font-mono tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                      required
                    />
                    <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                      {showNewPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type={showConfirmPin ? "text" : "password"}
                      inputMode="numeric" pattern="\d{4}" maxLength={4}
                      value={confirmPin} onChange={handleConfirmPinChange}
                      placeholder="Confirm New PIN" 
                      className="w-full pl-[48px] pr-12 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[14px] font-mono tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                      {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#FC6B31] text-white py-3.5 rounded-[18px] lg:rounded-[20px] font-extrabold text-[15px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-70 shrink-0"
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : "Update PIN"}
                  </button>
                </form>
              </div>
            )}

            {/* ==========================================
                STEP 4: SUCCESS
            ========================================== */}
            {step === 4 && (
              <div className="text-center space-y-4 py-8 animate-in zoom-in-95 duration-500 shrink-0 w-full">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50 mb-4">
                  <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                </div>
                {/* Header Title (35px) */}
                <h2 className="font-black text-gray-900 tracking-tight text-[35px] leading-tight">PIN Reset Successful!</h2>
                {/* Subtitle (16px) */}
                <p className="text-gray-500 font-medium leading-relaxed px-4 text-[16px]">
                  Your security PIN has been updated successfully. You can now use your new PIN to log in.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => router.push('/customer/login')}
                    className="w-full bg-[#FC6B31] text-white py-4 rounded-[18px] lg:rounded-[20px] font-extrabold text-[15px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98] transition-all"
                  >
                    Back to Log in
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="shrink-0 h-1" />
        </div>

        {/* RIGHT PANEL: Desktop Ambient Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#FDF7F2] p-8 items-center justify-center relative overflow-hidden border-l border-orange-100/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/30 pointer-events-none" />
          <img src="/woman_eating.png" alt="Enjoying ChopnChop" className="w-full h-full max-h-[500px] object-contain relative z-10 drop-shadow-xl transform hover:scale-105 transition-transform duration-700" />
        </div>

      </div>
    </div>
  );
}