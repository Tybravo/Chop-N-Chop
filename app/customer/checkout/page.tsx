"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Search, Wallet, CreditCard, ShieldCheck, Loader2, Tag, ChevronRight, Building2, Smartphone, Copy, Check, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import DynamicCreditCardDetector, { getCardInfo } from "@/components/customer/DynamicCreditCardDetector";
import { useCartStore } from "@/store/useCartStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://drive-thru-afia.onrender.com";

interface SavedCard {
  id: string;
  name: string;
  last4: string;
  brand: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems } = useCartStore();

  // ==========================================
  // 1. STATE DECLARATIONS
  // ==========================================
  const [view, setView] = useState<"contact" | "payment-details" | "add-card" | "bank-transfer">("contact");
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [primaryPaymentType, setPrimaryPaymentType] = useState<"wallet" | "online">("online");
  const [onlineSubMethod, setOnlineSubMethod] = useState<string>("card-1");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // --- MOCK USER STATUS (Toggle these to test the flows) ---
  const [isGuest, setIsGuest] = useState(false);
  const [userHasPin, setUserHasPin] = useState(false);

 // --- CARD MANAGEMENT ---
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: "card-1", name: "John-Daniel Ikechukwu", last4: "8047", brand: "VISA" },
    { id: "card-2", name: "John-Daniel Ikechukwu", last4: "1234", brand: "MasterCard" }
  ]);
  
  // Holds a temporary card for guest users so it isn't persisted to savedCards
  const [sessionCard, setSessionCard] = useState<SavedCard | null>(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // --- PIN MODAL STATE ---
  const [pinModal, setPinModal] = useState<{ show: boolean, mode: "ENTER" | "SET" }>({ show: false, mode: "ENTER" });
  const [paymentPin, setPaymentPin] = useState("");
  const [showPaymentPin, setShowPaymentPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("chopnchop_token") : null;

  // ==========================================
  // 2. PAYMENT VERIFICATION (Post-Paystack Redirect)
  // ==========================================
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) return;

    const verifyPayment = async () => {
      setIsVerifying(true);
      try {
        const token = getToken();
        // Call the verify endpoint when user returns from Paystack
        const res = await fetch(`${API_BASE_URL}/api/v1/payments/verify/${reference}`, {
          method: "GET",
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });

        if (res.ok) {
          router.push('/customer/success');
        } else {
          alert("Payment verification failed. Please contact support.");
          router.replace('/customer/checkout'); // Strip the reference param from URL
        }
      } catch (error) {
        console.error("Verification error:", error);
        alert("Network error during payment verification.");
        router.replace('/customer/checkout');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  // ==========================================
  // 3. COMPUTED VARIABLES & HANDLERS
  // ==========================================
  
  const rawPhoneLength = phoneNumber.replace(/\D/g, "").length;
  const isValidPhone = rawPhoneLength === 10 || rawPhoneLength === 11;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const truncated = numericValue.slice(0, 11);
    
    let formatted = truncated;
    if (truncated.length > 7) {
      formatted = `${truncated.slice(0, 4)} ${truncated.slice(4, 7)} ${truncated.slice(7)}`;
    } else if (truncated.length > 4) {
      formatted = `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
    }
    setPhoneNumber(formatted);
  };

  const cardInfo = getCardInfo(cardNumber);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const packagingFee = cartItems.length > 0 ? 500 : 0;
  const deliveryFee = cartItems.length > 0 ? 1500 : 0;
  const total = subtotal - discount + packagingFee + deliveryFee;

  const handleProceedToPaymentDetails = () => {
    if (!isValidPhone) {
      alert("Please provide a valid phone number for delivery updates.");
      return;
    }
    if (isGuest && !sessionCard) {
       setOnlineSubMethod("bank-transfer");
    } else if (isGuest && sessionCard) {
       setOnlineSubMethod(sessionCard.id);
    } else if (!isGuest && savedCards.length > 0) {
       setOnlineSubMethod(savedCards[0].id);
    }
    setView("payment-details");
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FIRST10") {
      setAppliedPromo("FIRST10 (10% Off)");
      setPromoCode("");
    } else {
      alert("Invalid promo code. Try 'FIRST10'");
    }
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardInfo.isValid) return;

    const newCardId = `card-temp-${Date.now()}`;
    const newCard = {
      id: newCardId,
      name: cardName || "Card Holder",
      last4: cardNumber.replace(/\D/g, "").slice(-4),
      brand: cardInfo.type
    };

    if (isGuest) {
      setSessionCard(newCard);
    } else {
      setSavedCards(prev => [...prev, newCard]);
    }

    setOnlineSubMethod(newCardId);
    setCardName(""); 
    setCardNumber(""); 
    setExpiryDate("");
    setView("payment-details");
  };

  // --- PAYMENT PROCESSING & SECURITY GUARDRAILS ---
  const processPaymentTransaction = async () => {
    setPinModal({ show: false, mode: "ENTER" });
    setIsProcessing(true);
    
    try {
      // In production, your cart-to-order logic happens here first to get an orderId.
      const mockOrderId = "ORD-" + Math.random().toString(36).substring(7);
      const token = getToken();

      // Initialize Paystack Checkout Session
      const res = await fetch(`${API_BASE_URL}/api/v1/payments/initialize/${mockOrderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to the Paystack checkout URL returned by the backend
        const checkoutUrl = data.checkoutUrl || data.authorization_url || data.additionalProp1;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("No checkout link provided by the server.");
        }
      } else {
        alert("Failed to initialize payment. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment initialization failed", error);
      alert("Network error starting payment.");
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = () => {
    if (onlineSubMethod === "bank-transfer") {
      setView("bank-transfer");
      return;
    }

    const isUsingSavedCard = !isGuest && savedCards.some(c => c.id === onlineSubMethod);

    if (isUsingSavedCard) {
      setPinModal({ show: true, mode: userHasPin ? "ENTER" : "SET" });
    } else {
      processPaymentTransaction();
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (paymentPin.length !== 4) return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API Verify/Set
      
      if (pinModal.mode === "ENTER") {
        if (paymentPin === "1234") { 
          processPaymentTransaction();
        } else {
          setPinError("Incorrect PIN. Please try again.");
          setIsProcessing(false);
        }
      } else {
        setUserHasPin(true);
        processPaymentTransaction();
      }
    } catch (err) {
      setPinError("Network error verifying PIN.");
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };


  // ==========================================
  // VIEW: FULL SCREEN VERIFICATION LOADER
  // ==========================================
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/10">
          <Loader2 className="w-8 h-8 text-[#FC6B31] animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Verifying Payment</h2>
          <p className="text-sm font-medium text-gray-500">Please wait while we confirm your transaction with Paystack.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: CONTACT DETAILS & PAYMENT SELECTION
  // ==========================================
  if (view === "contact") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 pb-36 overflow-x-hidden animate-in fade-in duration-300">
        <header className="sticky top-0 z-50 bg-[#F8F9FA]/90 dark:bg-zinc-950/90 backdrop-blur-md px-5 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex flex-col">
            <h1 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">Checkout</h1>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Step 1 of 2</span>
          </div>
          
          <button 
            onClick={() => setIsGuest(!isGuest)}
            className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-md"
          >
            {isGuest ? "GUEST" : "USER"}
          </button>
        </header>

        <div className="px-5 md:px-8 max-w-3xl mx-auto pt-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-zinc-800">
            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white mb-4 pl-1">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1.5 ml-1">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {phoneNumber.length > 0 && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isValidPhone ? 'text-emerald-500' : 'text-red-400'}`}>
                      {isValidPhone ? 'Valid' : 'Invalid'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className={`h-4 w-4 transition-colors ${isValidPhone ? 'text-emerald-500' : 'text-gray-400'}`} />
                  </div>
                  <input 
                    type="tel" 
                    required
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="0800 000 0000"
                    className={`w-full bg-gray-50 dark:bg-zinc-800/50 border rounded-xl pl-11 pr-4 py-3.5 text-[14px] font-mono text-gray-900 dark:text-white focus:outline-none transition-colors ${
                      phoneNumber && !isValidPhone 
                        ? 'border-red-300 focus:border-red-500 dark:border-red-900/50' 
                        : 'border-gray-200 dark:border-zinc-700 focus:border-[#FC6B31] dark:focus:border-[#FC6B31]'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-[#FC6B31] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white mb-3 pl-1">How do you want to pay?</h3>
            <div className="space-y-3">
              <div 
                onClick={() => setPrimaryPaymentType("online")}
                className={`flex items-center justify-between p-4 rounded-[24px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 ${primaryPaymentType === "online" ? "border-[#FC6B31] shadow-[0_4px_20px_rgba(252,107,49,0.1)]" : "border-transparent border-gray-50 dark:border-zinc-800"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-gray-900 dark:text-white">Pay Online</p>
                    <p className="text-[12px] text-gray-500">Cards, Transfer, USSD</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${primaryPaymentType === "online" ? "border-[#FC6B31]" : "border-gray-300 dark:border-zinc-700"}`}>
                  {primaryPaymentType === "online" && <div className="w-2.5 h-2.5 bg-[#FC6B31] rounded-full" />}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[24px] border-2 border-transparent bg-gray-50 dark:bg-zinc-900/50 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[15px] text-gray-700 dark:text-gray-400">Chop Wallet</p>
                      <span className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-[12px] text-gray-500">Feature temporarily disabled</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-zinc-700 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent dark:from-zinc-950 dark:via-zinc-950 pb-safe-offset-4 z-[200]">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={handleProceedToPaymentDetails}
              disabled={!isValidPhone}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4.5 rounded-[18px] font-bold text-[17px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PAYMENT DETAILS & SUMMARY
  // ==========================================
  if (view === "payment-details") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 pb-36 overflow-x-hidden animate-in slide-in-from-right-4 duration-300">
        <header className="sticky top-0 z-50 bg-[#F8F9FA]/90 dark:bg-zinc-950/90 backdrop-blur-md px-5 py-4 flex items-center justify-between">
          <button onClick={() => setView("contact")} className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex flex-col">
            <h1 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">Review & Pay</h1>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Step 2 of 2</span>
          </div>
          
          <button 
            onClick={() => setUserHasPin(!userHasPin)}
            className={`text-[10px] font-bold px-2 py-1 rounded-md ${userHasPin ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
            title="Toggle if user has set a PIN"
          >
            {userHasPin ? "PIN SET" : "NO PIN"}
          </button>
        </header>

        <div className="px-5 md:px-8 max-w-3xl mx-auto pt-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-zinc-800">
            <div className="px-4 pb-2 pt-3 space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 pb-1">Select Payment Option</p>
              
              {!isGuest && savedCards.map((card) => (
                <div 
                  key={card.id} 
                  onClick={() => setOnlineSubMethod(card.id)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${onlineSubMethod === card.id ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="font-bold text-[13px] text-gray-900 dark:text-white">{card.brand} •••• {card.last4}</span>
                  </div>
                  <input type="radio" checked={onlineSubMethod === card.id} readOnly className="accent-[#FC6B31]" />
                </div>
              ))}

              {isGuest && sessionCard && (
                <div 
                  onClick={() => setOnlineSubMethod(sessionCard.id)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${onlineSubMethod === sessionCard.id ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="font-bold text-[13px] text-gray-900 dark:text-white">{sessionCard.brand} •••• {sessionCard.last4}</span>
                  </div>
                  <input type="radio" checked={onlineSubMethod === sessionCard.id} readOnly className="accent-[#FC6B31]" />
                </div>
              )}

              <div 
                onClick={() => setView("add-card")}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#FC6B31] font-bold text-[13px] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add new card
              </div>
              
              <div 
                onClick={() => setOnlineSubMethod("bank-transfer")}
                className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${onlineSubMethod === "bank-transfer" ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-bold text-[13px] text-gray-900 dark:text-white">Bank Transfer</span>
                </div>
                <input type="radio" checked={onlineSubMethod === "bank-transfer"} readOnly className="accent-[#FC6B31]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-4 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px] text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FC6B31]" /> Promo Code
              </span>
              <button onClick={() => router.push('/customer/promos')} className="text-[12px] font-bold text-[#FC6B31] hover:underline flex items-center gap-1">
                View rewards <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input type="text" placeholder="Enter code (e.g. FIRST10)" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-white outline-none focus:border-[#FC6B31] transition-colors" />
              <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-xl text-[14px] font-bold active:scale-95 transition-transform shrink-0">Apply</button>
            </form>
          </div>

          <div className="pt-2 pb-12 px-2">
            <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100 dark:border-zinc-800/50">
                  <div className="flex items-start gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                      <p className="font-semibold text-[13px] text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[14px] text-gray-900 dark:text-white">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-[14px] text-gray-500 font-medium pt-2">
                <span>Food Subtotal:</span>
                <span className="font-bold text-gray-900 dark:text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                <span>Packaging & Consolidation:</span>
                <span className="font-bold text-gray-900 dark:text-white">₦{packagingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                <span>Zone Delivery Fee:</span>
                <span className="font-bold text-gray-900 dark:text-white">₦{deliveryFee.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[14px] text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-bold">-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-zinc-800 my-3" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-[16px] text-gray-900 dark:text-white">Total</span>
                <span className="font-black text-[20px] text-gray-900 dark:text-white">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent dark:from-zinc-950 dark:via-zinc-950 pb-safe-offset-4 z-[200]">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-[#FC6B31] text-white py-4.5 rounded-[18px] font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-orange-600 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing && !pinModal.show ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Pay ₦${total.toLocaleString()}`}
            </button>
          </div>
        </div>

        {/* SECURITY INTERCEPT MODAL: PIN AUTHORIZATION & SETUP */}
        {pinModal.show && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
              <button 
                onClick={() => { setPinModal({ show: false, mode: "ENTER" }); setPaymentPin(""); setPinError(null); setIsProcessing(false); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-50 dark:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 mx-auto mt-2">
                <Lock className="w-6 h-6 text-[#FC6B31]" />
              </div>
              
              <h3 className="text-[18px] font-black text-gray-900 dark:text-white text-center mb-2 tracking-tight">
                {pinModal.mode === "ENTER" ? "Confirm Payment" : "Secure Your Account"}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed px-2">
                {pinModal.mode === "ENTER" 
                  ? "Enter your 4-digit PIN to securely authorize this transaction."
                  : "For your security, you must set a 4-digit PIN before using a saved payment method."}
              </p>

              {pinError && (
                <div className="p-2.5 bg-red-50 text-red-600 text-[12px] font-bold rounded-xl text-center mb-4">
                  {pinError}
                </div>
              )}

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPaymentPin ? "text" : "password"} 
                    inputMode="numeric" pattern="\d{4}" maxLength={4} required autoFocus autoComplete="new-password"
                    placeholder={pinModal.mode === "ENTER" ? "Enter PIN" : "Create PIN"}
                    value={paymentPin}
                    onChange={(e) => setPaymentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-[16px] text-[20px] font-mono tracking-[0.5em] text-center text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FC6B31] focus:ring-1 focus:ring-[#FC6B31] transition-all shadow-inner"
                  />
                  <button type="button" onClick={() => setShowPaymentPin(!showPaymentPin)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showPaymentPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button 
                  disabled={isProcessing || paymentPin.length !== 4} 
                  type="submit" 
                  className="w-full py-4 bg-[#FC6B31] hover:bg-orange-600 text-white font-extrabold rounded-[16px] shadow-lg shadow-orange-500/30 transition-all text-[15px] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : pinModal.mode === "ENTER" ? "Authorize & Pay" : "Save PIN & Pay"}
                </button>
              </form>
              
              {pinModal.mode === "ENTER" && (
                <div className="text-center pt-4">
                  <button type="button" className="text-[12px] font-bold text-[#FC6B31] hover:underline">Forgot PIN?</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: BANK TRANSFER 
  // ==========================================
  if (view === "bank-transfer") {
    const virtualAccount = {
      bankName: "Wema Bank",
      accountNumber: "0238491029",
      accountName: "ChopnChop Global / John-Daniel",
      amount: total,
    };

    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 animate-in slide-in-from-right-4 duration-300">
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between">
          <button onClick={() => setView("payment-details")} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Bank Transfer</h1>
          <div className="w-10" />
        </header>
        <div className="px-5 md:px-8 max-w-md mx-auto pt-6 space-y-6 text-center">
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
            <p className="text-[13px] text-gray-500">Please make a transfer of the exact amount below to the account number provided:</p>
            <div className="py-2">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
              <h2 className="text-3xl font-black text-[#FC6B31] mt-1">₦{virtualAccount.amount.toLocaleString()}</h2>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-4 text-left space-y-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Bank Name</span>
                <p className="font-bold text-[15px] text-gray-900 dark:text-white">{virtualAccount.bankName}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Account Number</span>
                  <p className="font-mono font-extrabold text-[20px] text-gray-900 dark:text-white tracking-wider">{virtualAccount.accountNumber}</p>
                </div>
                <button onClick={() => handleCopy(virtualAccount.accountNumber, "acc")} className="p-2.5 rounded-xl bg-white dark:bg-zinc-700 shadow-sm text-[#FC6B31] flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform">
                  {copiedField === "acc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedField === "acc" ? "Copied" : "Copy"}
                </button>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Account Name</span>
                <p className="font-medium text-[13px] text-gray-700 dark:text-gray-300">{virtualAccount.accountName}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                router.push('/customer/success');
              }, 2000);
            }}
            disabled={isProcessing}
            className="w-full bg-[#FC6B31] text-white py-4.5 rounded-[18px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600"
          >
            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</> : "I have made this transfer"}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: ADD NEW CARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between">
        <button onClick={() => setView("payment-details")} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Add Card</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 md:px-8 max-w-3xl mx-auto pt-4 space-y-8">
        <DynamicCreditCardDetector cardNumber={cardNumber} cardName={cardName} expiryDate={expiryDate} cardInfo={cardInfo} />
        <form onSubmit={handleAddNewCard} className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Card Holder Name</label>
            <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 transition-colors" />
          </div>
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Card Number</label>
            <input type="text" value={cardNumber} onChange={(e) => {
                const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                setCardNumber(formatted);
              }} maxLength={19} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white font-mono outline-none focus:border-gray-300 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Expiry Date</label>
              <input type="text" value={expiryDate} onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const formatted = val.length > 2 ? val.slice(0, 2) + '/' + val.slice(2, 4) : val;
                  setExpiryDate(formatted);
                }} maxLength={5} placeholder="MM/YY" className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 transition-colors" />
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">CVV</label>
              <input type="password" placeholder="***" className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 transition-colors" />
            </div>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe-offset-4 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 z-[200]">
            <div className="max-w-3xl mx-auto">
              <button 
                type="submit"
                disabled={!cardInfo.isValid}
                className={`w-full py-4.5 rounded-[18px] font-bold text-[16px] transition-all ${cardInfo.isValid ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-[0.98]" : "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"}`}
              >
                {cardInfo.isValid ? "Save & Continue" : "Enter Valid Card"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}