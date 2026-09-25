"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Clock, FileText, Copy, Check, UserPlus, ArrowRight, Lock, Eye, EyeOff, Loader2, X } from "lucide-react";
import OrderReceiptModal from "@/components/customer/OrderReceiptModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://afia-a2le.onrender.com";

export default function OrderSuccessPage() {
  const router = useRouter();
  
  // --- Standard Page State ---
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Guest Claim State ---
  const [claimStep, setClaimStep] = useState<"PROMPT" | "PIN">("PROMPT");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock order details (in production, this comes from your checkout session state)
  const orderDetails = {
    id: "ORD-8574",
    pickupCode: "X7B9Q2",
    date: "April 12, 2026 | 07:30 PM",
    paymentMethod: "Credit Card",
    deliveryWindow: "Today, 1:00 PM - 2:00 PM",
    vendorName: "Mamma Mia Italian",
    deliveryAddress: "14 Allen Avenue, Ikeja, Lagos",
    items: [
      { id: 1, name: "Melting Cheese Pizza", desc: "8'' Small", qty: 1, price: 11880, vendorName: "Mamma Mia Italian" },
      { id: 2, name: "Chicken Salad", desc: "Medium", qty: 2, price: 9120, vendorName: "Healthy Eats" }
    ],
    subtotal: 21000,
    deliveryFee: 1500,
    total: 22500,
    status: "Confirmed & Processing",
    // Simulating the guest email captured during checkout
    guestEmail: "guest@example.com" 
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pin.length !== 4) return;

    setIsLoading(true);
    try {
      // API call to upgrade guest account using their checkout email and new PIN
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/guest/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: orderDetails.guestEmail, pin }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Store JWT safely and mark session as active
        localStorage.setItem("chopnchop_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("chopnchop_refresh", data.refresh_token);
        localStorage.setItem("chopnchop_session", "active");
        
        // Reroute to home/tracker as a fully authenticated user
        router.push("/customer/home");
      } else {
        setError("Failed to secure account. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col relative pb-12">
      <header className="px-4 py-5 flex items-center justify-between">
        <button onClick={() => router.push('/customer/home')} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9" />
      </header>

      <div className="flex-1 flex flex-col items-center px-5 max-w-md mx-auto w-full pt-2 animate-in zoom-in-95 duration-500">
        
        {/* 1. Success Animation */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <PackageCheck className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight text-center">
          Order Confirmed!
        </h1>
        <p className="text-center text-[14px] text-gray-500 mb-8 leading-relaxed max-w-[280px]">
          Your order has been placed successfully. We are coordinating your delivery drop.
        </p>

        {/* 2. The 6-Digit Verification Code */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-zinc-800 text-center relative overflow-hidden mb-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#FC6B31]" />
          
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Your Drop Code
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-4xl font-black tracking-[0.2em] text-gray-900 dark:text-white font-mono ml-2">
              {orderDetails.pickupCode}
            </h2>
            <button 
              onClick={handleCopy}
              className="p-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-500 hover:text-[#FC6B31] hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors active:scale-95"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 py-2 px-4 rounded-full inline-flex">
            <PackageCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Give this code to the rider upon delivery</span>
          </div>
        </div>

        {/* 3. Expected Delivery Window */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[20px] p-4 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wider">
              Expected Delivery
            </p>
            <p className="font-extrabold text-[14px] text-gray-900 dark:text-white tracking-tight">
              {orderDetails.deliveryWindow}
            </p>
          </div>
        </div>

        {/* 4. THE RETENTION PIVOT (Interactive Guest Claim) */}
        <div className="w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group mb-6 min-h-[220px] transition-all duration-300 flex flex-col justify-center">
          
          {/* Faded Map Background Layer */}
          <div 
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10] pointer-events-none bg-cover bg-center transition-opacity"
            style={{ backgroundImage: `url('/map.png')` }}
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#FC6B31_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />
          
          <div className="relative z-10 w-full">
            {claimStep === "PROMPT" ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <UserPlus className="w-6 h-6 text-[#FC6B31]" />
                </div>
                <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2 leading-tight text-center">
                  Track this order live &<br />checkout faster next time.
                </h3>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-center">
                  Create an account in 10 seconds to save your delivery preferences and track your rider on the map.
                </p>
                <button 
                  onClick={() => setClaimStep("PIN")}
                  className="w-full bg-[#FC6B31] text-white py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                >
                  Create Account <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimAccount} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[16px] font-extrabold text-gray-900 dark:text-white tracking-tight">Secure your account</h3>
                  <button 
                    type="button" 
                    onClick={() => { setClaimStep("PROMPT"); setError(null); setPin(""); }} 
                    className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 mb-4 leading-relaxed">
                  Set a 4-digit PIN for <span className="font-bold text-gray-700 dark:text-gray-300">{orderDetails.guestEmail}</span> to claim your rewards and track this drop.
                </p>

                {error && (
                  <div className="p-2.5 bg-red-50 text-red-600 text-[12px] font-bold rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPin ? "text" : "password"} 
                    inputMode="numeric" 
                    pattern="\d{4}" 
                    maxLength={4} 
                    required
                    placeholder="Create 4-Digit PIN" 
                    autoFocus
                    autoComplete="new-password" // Prevents aggressive browser autofill
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full pl-[44px] pr-12 py-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-[16px] text-[16px] font-mono tracking-widest text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button 
                  disabled={isLoading || pin.length !== 4} 
                  type="submit" 
                  className="w-full py-4 px-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[16px] shadow-lg shadow-orange-500/30 transition-all text-[15px] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure & Claim Account"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Secondary Action: View Receipt */}
        <button 
          onClick={() => setIsReceiptOpen(true)}
          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white py-4 rounded-[16px] font-bold text-[15px] flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98]"
        >
          <FileText className="w-4 h-4 text-gray-500" /> View E-Receipt
        </button>
      </div>

      <OrderReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={orderDetails}
      />
    </div>
  );
}