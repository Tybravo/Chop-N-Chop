"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, Search, Trash2, Wallet, CreditCard, ShieldCheck, Loader2, Tag, ChevronRight, Building2, Smartphone, Copy, Check, ExternalLink } from "lucide-react";
import DynamicCreditCardDetector, { getCardInfo } from "@/components/customer/DynamicCreditCardDetector";

export default function CheckoutPage() {
  const router = useRouter();

  // --- UI States ---
  const [view, setView] = useState<"summary" | "add-card" | "bank-transfer">("summary");
  
  // Primary payment type: "wallet" or "online"
  const [primaryPaymentType, setPrimaryPaymentType] = useState<"wallet" | "online">("online");
  
  // Sub-method when "online" is selected: e.g., "card-1", "bank-transfer", "opay", "zap"
  const [onlineSubMethod, setOnlineSubMethod] = useState<string>("card-1");

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // --- Cart Data State ---
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Grilled chicken breast", desc: "Tender grilled chicken breast, seasoned.", qty: 1, price: 3970, image: "/hero-food-illustration.png" },
    { id: 2, name: "Crunchy Taco Supreme", desc: "A crispy, flavor-packed Crunchy Taco Supreme.", qty: 2, price: 4000, image: "/hero-food-illustration.png" },
    { id: 3, name: "El Combo", desc: "Regular, Grilled Chicken Quesadilla, Nacho.", qty: 1, price: 6500, image: "/hero-food-illustration.png" }
  ]);

  // --- Saved Cards State ---
  const [savedCards, setSavedCards] = useState([
    { id: "card-1", name: "John-Daniel Ikechukwu", last4: "8047", brand: "VISA" },
    { id: "card-2", name: "John-Daniel Ikechukwu", last4: "1234", brand: "MasterCard" }
  ]);

  // --- New Card Form States ---
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const cardInfo = getCardInfo(cardNumber);

  // --- Math ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const deliveryFee = 0; 
  const total = subtotal - discount + deliveryFee;

  // --- Handlers ---
  const updateQuantity = (id: number, delta: number) => {
    setPendingDeleteId(null);
    setCartItems(items => items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const handleMinusClick = (id: number, currentQty: number) => {
    if (currentQty === 1) {
      if (pendingDeleteId === id) {
        setCartItems(items => items.filter(item => item.id !== id));
        setPendingDeleteId(null);
      } else {
        setPendingDeleteId(id);
      }
    } else {
      updateQuantity(id, -1);
    }
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

    const newCardId = `card-${Date.now()}`;
    const newCard = {
      id: newCardId,
      name: cardName || "Card Holder",
      last4: cardNumber.replace(/\D/g, "").slice(-4),
      brand: cardInfo.type
    };

    setSavedCards(prev => [...prev, newCard]);
    setOnlineSubMethod(newCardId);
    setPrimaryPaymentType("online");
    setCardName(""); 
    setCardNumber(""); 
    setExpiryDate("");
    setView("summary");
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = async () => {
    if (primaryPaymentType === "online" && onlineSubMethod === "bank-transfer") {
      setView("bank-transfer");
      return;
    }

    setIsProcessing(true);
    try {
      const selectedPayment = primaryPaymentType === "wallet" ? "Chop Wallet" : onlineSubMethod;
      const payload = { amount: total, paymentMethod: selectedPayment, items: cartItems };
      console.log("Processing payment...", payload);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/customer/success');
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };


  // ==========================================
  // VIEW 3: BANK TRANSFER INSTRUCTION PAGE
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
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
          <button onClick={() => setView("summary")} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-full transition-colors">
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
                <button 
                  onClick={() => handleCopy(virtualAccount.accountNumber, "acc")}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-700 shadow-sm text-[#FC6B31] flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
                >
                  {copiedField === "acc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedField === "acc" ? "Copied" : "Copy"}
                </button>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Account Name</span>
                <p className="font-medium text-[13px] text-gray-700 dark:text-gray-300">{virtualAccount.accountName}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-xl text-[12px] font-medium text-left">
              ⏳ Account expires in <span className="font-bold">29:45</span>. Your payment will be confirmed automatically once received.
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
            className="w-full bg-[#FC6B31] hover:bg-orange-600 text-white py-4.5 rounded-[18px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirming Transfer...</> : "I have made this transfer"}
          </button>
        </div>
      </div>
    );
  }


  // ==========================================
  // VIEW 1: SUMMARY & PAYMENT ARCHITECTURE
  // ==========================================
  if (view === "summary") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 pb-36 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-[#F8F9FA]/90 dark:bg-zinc-950/90 backdrop-blur-md px-5 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-bold text-gray-900 dark:text-white">Checkout</h1>
          <button className="w-11 h-11 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm text-gray-900 dark:text-white">
            <Search className="w-5 h-5" />
          </button>
        </header>

        <div className="px-5 md:px-8 max-w-3xl mx-auto pt-4 space-y-6">
          
          {/* CART ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const isConfirmingDelete = pendingDeleteId === item.id;
              return (
                <div key={item.id} className="flex gap-4 items-center w-full bg-white dark:bg-zinc-900 p-3 rounded-[28px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-zinc-800">
                  <div className="w-[85px] h-[85px] bg-gray-50 dark:bg-zinc-800 rounded-[20px] overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                    <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight truncate">{item.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                    <span className="font-bold text-[16px] text-[#FC6B31] mt-2">₦{item.price.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col items-center justify-between bg-gray-50 dark:bg-zinc-800/50 py-1.5 px-1 rounded-full border border-gray-100 dark:border-zinc-700/50 h-[92px] w-[42px] shrink-0">
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-600 shadow-sm hover:text-[#FC6B31] shrink-0 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center w-full">
                      <span className="font-bold text-[14px] text-gray-900 dark:text-white leading-none tabular-nums">{item.qty}</span>
                    </div>

                    <button 
                      onClick={() => handleMinusClick(item.id, item.qty)} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${isConfirmingDelete ? "bg-red-500 text-white shadow-md animate-pulse" : "text-gray-400 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm"}`}
                    >
                      {isConfirmingDelete ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==========================================
              TWO-TIER PAYMENT METHOD SELECTOR
          ========================================== */}
          <div className="pt-2">
            <h3 className="font-bold text-[16px] text-gray-900 dark:text-white mb-3 pl-1">Payment Method</h3>
            <div className="space-y-3">
              
              {/* TIER 1: Chop Wallet Option */}
              <div 
                onClick={() => setPrimaryPaymentType("wallet")}
                className={`flex items-center justify-between p-4 rounded-[24px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 ${primaryPaymentType === "wallet" ? "border-[#FC6B31] shadow-[0_4px_20px_rgba(252,107,49,0.1)]" : "border-transparent border-gray-50 dark:border-zinc-800"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-gray-900 dark:text-white">Chop Wallet</p>
                    <p className="text-[12px] text-gray-500">Balance: ₦45,000</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${primaryPaymentType === "wallet" ? "border-[#FC6B31]" : "border-gray-300 dark:border-zinc-700"}`}>
                  {primaryPaymentType === "wallet" && <div className="w-2.5 h-2.5 bg-[#FC6B31] rounded-full" />}
                </div>
              </div>

              {/* TIER 1: Pay Online (Instant & Alternative Channels) */}
              <div 
                onClick={() => setPrimaryPaymentType("online")}
                className={`flex flex-col rounded-[24px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 overflow-hidden ${primaryPaymentType === "online" ? "border-[#FC6B31] shadow-[0_4px_20px_rgba(252,107,49,0.1)]" : "border-transparent border-gray-50 dark:border-zinc-800"}`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-gray-900 dark:text-white">Pay Online</p>
                      <p className="text-[12px] text-gray-500">Card, Bank Transfer, OPay, Zap &amp; more</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${primaryPaymentType === "online" ? "border-[#FC6B31]" : "border-gray-300 dark:border-zinc-700"}`}>
                    {primaryPaymentType === "online" && <div className="w-2.5 h-2.5 bg-[#FC6B31] rounded-full" />}
                  </div>
                </div>

                {/* TIER 2: Clean Simplified Gateway Options */}
                {primaryPaymentType === "online" && (
                  <div className="px-4 pb-4 pt-1 space-y-2 border-t border-gray-100 dark:border-zinc-800 animate-in fade-in duration-200">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-2 pl-1">Choose Payment Option</p>

                    {/* Saved Cards List */}
                    {savedCards.map((card) => (
                      <div 
                        key={card.id} 
                        onClick={(e) => { e.stopPropagation(); setOnlineSubMethod(card.id); }}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${onlineSubMethod === card.id ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="font-bold text-[13px] text-gray-900 dark:text-white">{card.brand} •••• {card.last4}</span>
                        </div>
                        <input type="radio" checked={onlineSubMethod === card.id} onChange={() => {}} className="accent-[#FC6B31]" />
                      </div>
                    ))}

                    {/* Add New Card Action */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setView("add-card"); }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#FC6B31] font-bold text-[13px] transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add new card
                    </div>

                    {/* Bank Transfer Option */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setOnlineSubMethod("bank-transfer"); }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${onlineSubMethod === "bank-transfer" ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-[13px] text-gray-900 dark:text-white">Bank Transfer</span>
                      </div>
                      <input type="radio" checked={onlineSubMethod === "bank-transfer"} onChange={() => {}} className="accent-[#FC6B31]" />
                    </div>

                    {/* OPay / Zap Option */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setOnlineSubMethod("opay"); }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${onlineSubMethod === "opay" ? "bg-orange-50/80 dark:bg-orange-500/15" : "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-[13px] text-gray-900 dark:text-white">OPay / Zap App</span>
                      </div>
                      <input type="radio" checked={onlineSubMethod === "opay"} onChange={() => {}} className="accent-[#FC6B31]" />
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* PROMO CODE SECTION */}
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-4 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px] text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FC6B31]" /> Promo Code
              </span>
              <button 
                onClick={() => router.push('/customer/promos')}
                className="text-[12px] font-bold text-[#FC6B31] hover:underline flex items-center gap-1"
              >
                View rewards <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter code (e.g. FIRST10)" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-white outline-none focus:border-[#FC6B31] transition-colors" 
              />
              <button 
                type="submit" 
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-xl text-[14px] font-bold active:scale-95 transition-transform shrink-0"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <p className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg">
                Applied: {appliedPromo}
              </p>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="pt-2 pb-12 px-2">
            <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                <span>Subtotals for products:</span>
                <span className="font-bold text-gray-900 dark:text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[14px] text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-bold">-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                <span>Delivery shipping:</span>
                <span className="font-bold text-gray-900 dark:text-white">{deliveryFee === 0 ? "Free" : `₦{deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-zinc-800 my-3" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-[16px] text-gray-900 dark:text-white">Total</span>
                <span className="font-black text-[20px] text-gray-900 dark:text-white">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CHECKOUT BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent dark:from-zinc-950 dark:via-zinc-950 pb-safe-offset-4 z-[200]">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4.5 rounded-[18px] font-bold text-[17px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Checkout"}
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: ADD NEW CARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between">
        <button onClick={() => setView("summary")} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Add Card</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 md:px-8 max-w-3xl mx-auto pt-4 space-y-8">
        
        <DynamicCreditCardDetector 
          cardNumber={cardNumber} cardName={cardName} expiryDate={expiryDate} cardInfo={cardInfo}
        />

        <form onSubmit={handleAddNewCard} className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Card Holder Name</label>
            <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" />
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 block">Card Number</label>
            </div>
            <input type="text" value={cardNumber} onChange={(e) => {
                const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                setCardNumber(formatted);
              }} maxLength={19} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white font-mono outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" />
          </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Expiry Date</label>
               <input type="text" value={expiryDate} onChange={(e) => {
                   const val = e.target.value.replace(/\D/g, '');
                   const formatted = val.length > 2 ? val.slice(0, 2) + '/' + val.slice(2, 4) : val;
                   setExpiryDate(formatted);
                 }} maxLength={5} placeholder="MM/YY" className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" />
             </div>
             <div>
               <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">CVV</label>
               <input type="password" placeholder="***" className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" />
             </div>
           </div>

           <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe-offset-4 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 z-[200]">
            <div className="max-w-3xl mx-auto">
              <button 
                type="submit"
                disabled={!cardInfo.isValid}
                className={`w-full py-4.5 rounded-[18px] font-bold text-[16px] transition-all ${cardInfo.isValid ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90" : "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"}`}
                style={{ padding: '1.125rem' }}
              >
                {cardInfo.isValid ? "Save Card" : "Enter Valid Card"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}