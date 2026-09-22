"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, Loader2, Sparkles } from "lucide-react";

// Fallback to the provided render URL if env var is missing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://afia-a2le.onrender.com";

type AuthStep = "EMAIL" | "PIN" | "OTP";

export default function LoginPage() {
  const router = useRouter();
  
  // --- State ---
  const [step, setStep] = useState<AuthStep>("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showPin, setShowPin] = useState(false);

  // --- Handlers ---
  
  // Step 1: Check Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const checkRes = await fetch(`${API_BASE_URL}/api/v1/auth/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.hasPin) {
        // Returning user with a PIN setup
        setStep("PIN");
      } else {
        // New user OR existing user who hasn't set a PIN yet -> Send OTP
        const startRes = await fetch(`${API_BASE_URL}/api/v1/auth/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (startRes.ok) {
          setStep("OTP");
        } else {
          // Parse the actual backend error to see why it's failing
          const errorData = await startRes.json().catch(() => ({}));
          console.error("Backend OTP Error:", errorData);
          setError(errorData.message || "Failed to send verification code. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2A: Login with PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pin.length !== 4) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), pin }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store JWT safely
        localStorage.setItem("chopnchop_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("chopnchop_refresh", data.refresh_token);
        localStorage.setItem("chopnchop_session", "active");
        
        router.push("/customer/home");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Incorrect PIN. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2B: Verify OTP (New Users / No PIN users)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) return; // Assuming 6-digit OTP

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("chopnchop_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("chopnchop_refresh", data.refresh_token);
        localStorage.setItem("chopnchop_session", "active");
        
        // Push to home (System will prompt for PIN setup later as requested)
        router.push("/customer/home");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Invalid verification code. Please check and try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      if (!res.ok) {
         const errorData = await res.json().catch(() => ({}));
         setError(errorData.message || "Failed to resend code.");
      }
    } catch (err) {
      setError("Network error. Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FFFBF7] flex items-center justify-center p-4 lg:p-8 overflow-hidden selection:bg-[#FC6B31] selection:text-white animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <div className="w-full max-w-5xl h-full lg:h-auto lg:max-h-[720px] bg-white rounded-[28px] lg:rounded-[40px] shadow-sm lg:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row border border-orange-100/60 overflow-hidden relative">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 px-6 py-5 lg:p-12 flex flex-col h-full justify-between overflow-hidden relative">
          
          {/* Back Button for multi-step */}
          {step !== "EMAIL" && (
            <button 
              onClick={() => { setStep("EMAIL"); setError(null); setPin(""); setOtp(""); }}
              className="absolute top-6 left-6 lg:top-8 lg:left-8 p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Header Title */}
          <div className="text-center shrink-0 pt-8 lg:pt-4">
            <h2 className="font-black text-gray-900 tracking-tight text-[32px] lg:text-[35px] leading-tight">
              {step === "EMAIL" ? "Welcome" : step === "PIN" ? "Enter PIN" : "Verify Email"}
            </h2>
          </div>

          {/* Mobile Illustration (Dynamic based on step) */}
          <div className="w-full flex flex-col items-center lg:hidden shrink-0 my-2">
            <div className="flex min-h-[140px] max-h-[190px] w-full justify-center items-center overflow-hidden mb-2">
              <Image 
                src={step === "EMAIL" ? "/CNC-bowl%20of%20jolof%20rice%20chicken%20plantain.png" : "/food_pack.png"} 
                alt="ChopnChop Illustration" 
                width={340}
                height={190}
                priority
                className="max-h-full w-auto max-w-[340px] object-contain drop-shadow-md transition-all duration-300" 
              />
            </div>
          </div>

          {/* Subtext */}
          <div className="text-center shrink-0 mb-6 lg:mb-8">
            <p className="text-gray-500 font-medium text-[15px] lg:text-[16px] px-4">
              {step === "EMAIL" && "Enter your email to log in or create a new account."}
              {step === "PIN" && `Welcome back! Enter your 4-digit PIN for ${email}`}
              {step === "OTP" && `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Form Area */}
          <div className="w-full max-w-sm mx-auto shrink-0 space-y-4">
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-[13px] font-medium rounded-xl text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === "EMAIL" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4 w-full animate-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email" required placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-[48px] pr-4 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                  />
                </div>

                <button disabled={isLoading} type="submit" className="w-full py-3.5 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[18px] lg:rounded-[20px] shadow-lg shadow-orange-500/30 transition-all text-[15px] tracking-wide active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                </button>

                {/* Google OAuth Stub */}
                <div className="pt-4 flex flex-col gap-3">
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                  </div>
                  <button type="button" className="w-full py-3.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-[18px] lg:rounded-[20px] transition-all text-[14px] flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]">
                    <Image 
                      src="https://www.svgrepo.com/show/475656/google-color.svg" 
                      alt="Google" 
                      width={20} 
                      height={20} 
                      unoptimized
                      className="w-5 h-5" 
                    />
                    Continue with Google
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2A: PIN */}
            {step === "PIN" && (
              <form onSubmit={handlePinSubmit} className="space-y-4 w-full animate-in slide-in-from-right-4 duration-300">
                
                {/* DUMMY INPUTS TO ABSORB BROWSER AUTOFILL */}
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} aria-hidden="true" />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} aria-hidden="true" />
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPin ? "text" : "password"} 
                    inputMode="numeric" 
                    pattern="\d{4}" 
                    maxLength={4} 
                    required
                    placeholder="4-Digit PIN" 
                    autoFocus
                    autoComplete="one-time-code" // Tricks password managers into ignoring this field
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full pl-[48px] pr-12 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[18px] font-mono tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex justify-end px-1">
                  <button type="button" onClick={() => {/* Trigger Forgot PIN Flow */}} className="text-[13px] font-extrabold text-[#FC6B31] hover:underline">
                    Forgot PIN?
                  </button>
                </div>

                <button disabled={isLoading || pin.length !== 4} type="submit" className="w-full py-3.5 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[18px] lg:rounded-[20px] shadow-lg shadow-orange-500/30 transition-all text-[15px] tracking-wide active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Log In"}
                </button>
              </form>
            )}

            {/* STEP 2B: OTP */}
            {step === "OTP" && (
              <form onSubmit={handleOtpSubmit} className="space-y-4 w-full animate-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type="text" inputMode="numeric" maxLength={6} required
                    placeholder="6-Digit Code" autoFocus
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full pl-[48px] pr-4 py-3.5 bg-white border border-gray-200 rounded-[18px] lg:rounded-[20px] text-[18px] font-mono tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm text-center"
                  />
                </div>

                <button disabled={isLoading || otp.length < 6} type="submit" className="w-full py-3.5 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[18px] lg:rounded-[20px] shadow-lg shadow-orange-500/30 transition-all text-[15px] tracking-wide active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                </button>

                <div className="text-center pt-2">
                  <button type="button" onClick={resendOtp} disabled={isLoading} className="text-[14px] font-bold text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors">
                    Didn&apos;t receive it? <span className="text-[#FC6B31] hover:underline">Resend Code</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          <div className="shrink-0 h-1 hidden lg:block" />
        </div>

        {/* RIGHT PANEL: Desktop Ambient Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#FDF7F2] p-8 items-center justify-center relative overflow-hidden border-l border-orange-100/50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/30 pointer-events-none" />
          
          <Image 
            src="/CNC-man%20riding%20bike.png" 
            alt="ChopnChop Rider Delivery" 
            width={500}
            height={500}
            priority
            className="w-full h-full max-h-[500px] object-contain relative z-10 drop-shadow-xl transform hover:scale-105 transition-transform duration-700" 
          />
          
          <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FC6B31]" />
              <span className="text-[13px] font-extrabold text-gray-800">Fast, scheduled, and reliable drops.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}