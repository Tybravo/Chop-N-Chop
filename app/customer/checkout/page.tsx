"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Banknote, CreditCard, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import OrderReceiptModal from "@/components/customer/OrderReceiptModal"; // Import the decoupled reusable receipt component

export default function CheckoutPage() {
  const router = useRouter();

  // --- States ---
  const [view, setView] = useState<"summary" | "add-card">("summary");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wallet" | "card">("card");
  
  // Receipt Modal State for Checkout Success / Review
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // --- Dynamic Card States ---
  const [cardName, setCardName] = useState("John-Daniel Ikechukwu");
  const [cardNumber, setCardNumber] = useState("4716 9627 1635 8047");
  const [expiryDate, setExpiryDate] = useState("02/30");

  const getCardBrand = (number: string) => {
    const cleanNum = number.replace(/\D/g, '');
    if (cleanNum.startsWith("4")) return "VISA";
    if (cleanNum.startsWith("5")) return "Mastercard";
    if (cleanNum.startsWith("34") || cleanNum.startsWith("37")) return "AMEX";
    if (cleanNum.startsWith("6")) return "Discover";
    return "CARD";
  };

  // --- Mock Summary Data ---
  const orderDetails = {
    id: "ORD-7742",
    items: [
      { id: 1, name: "Melting Cheese Pizza", desc: "8'' Small", qty: 1, price: 11880 },
      { id: 2, name: "Chicken Salad", desc: "Medium", qty: 2, price: 9120 }
    ],
    subtotal: 21000,
    deliveryFee: 1500,
    total: 22500,
    date: "April 12, 2026 | 07:30 PM",
    deliveryAddress: "14 Allen Avenue, Ikeja, Lagos",
    vendorName: "Mamma Mia Italian",
    paymentMethod: "Credit Card",
    status: "Confirmed & Processing"
  };

  // ==========================================
  // VIEW 1: CHECKOUT SUMMARY & PAYMENT METHODS
  // ==========================================
  if (view === "summary") {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32">
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Checkout</h1>
          <div className="w-9" />
        </header>

        <div className="px-5 md:px-8 max-w-3xl mx-auto pt-6 space-y-8">
          
          {/* --- REVIEW SUMMARY --- */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Review Summary</h3>
              <button 
                onClick={() => setIsReceiptOpen(true)}
                className="text-xs font-extrabold text-[#FC6B31] hover:underline"
              >
                Preview Receipt
              </button>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] border border-gray-100 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
              
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-[12px] text-gray-500">{item.desc} • Qty: {item.qty}</p>
                  </div>
                  <span className="font-extrabold text-[14px] text-gray-900 dark:text-white">₦{item.price.toLocaleString()}</span>
                </div>
              ))}

              <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 my-2" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderDetails.date}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500">Delivery To</span>
                  <span className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{orderDetails.deliveryAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- PAYMENT METHODS --- */}
          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              
              <div 
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-between p-4 rounded-[20px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 ${paymentMethod === "cash" ? "border-gray-900 dark:border-white shadow-sm" : "border-transparent border-gray-50 dark:border-zinc-800"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="font-bold text-[15px] text-gray-900 dark:text-white">Cash on Delivery</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cash" ? "border-gray-900 dark:border-white" : "border-gray-300 dark:border-zinc-700"}`}>
                  {paymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-gray-900 dark:bg-white rounded-full" />}
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod("wallet")}
                className={`flex items-center justify-between p-4 rounded-[20px] border-2 transition-all cursor-pointer bg-white dark:bg-zinc-900 ${paymentMethod === "wallet" ? "border-gray-900 dark:border-white shadow-sm" : "border-transparent border-gray-50 dark:border-zinc-800"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-gray-900 dark:text-white">Chop Wallet</span>
                    <span className="text-[12px] text-gray-500">Balance: ₦45,000</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "wallet" ? "border-gray-900 dark:border-white" : "border-gray-300 dark:border-zinc-700"}`}>
                  {paymentMethod === "wallet" && <div className="w-2.5 h-2.5 bg-gray-900 dark:bg-white rounded-full" />}
                </div>
              </div>

              <div 
                onClick={() => setView("add-card")}
                className="flex items-center justify-between p-4 rounded-[20px] border-2 border-transparent border-gray-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer hover:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="font-bold text-[15px] text-gray-900 dark:text-white">Credit & Debit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-500 font-medium">Add Card</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- FIXED BOTTOM CHECKOUT BAR --- */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 p-4 pb-safe-offset-4 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-between items-center px-2 text-[15px]">
              <span className="font-semibold text-gray-500">Total Payment</span>
              <span className="font-extrabold text-xl text-gray-900 dark:text-white">₦{orderDetails.total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => router.push('/customer/success')} 
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              style={{ padding: '1.125rem' }}
            >
              Confirm Payment <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REUSABLE RECEIPT MODAL INSTANCE */}
        <OrderReceiptModal 
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          order={orderDetails}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ADD NEW CARD (Dynamic)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 animate-in slide-in-from-right-4 duration-300">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between">
        <button onClick={() => setView("summary")} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Add Card</h1>
        <div className="w-9" />
      </header>

      <div className="px-4 md:px-8 max-w-3xl mx-auto pt-4 space-y-8">
        
        {/* --- BEAUTIFUL RESPONSIVE CARD MOCKUP --- */}
        <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black rounded-[24px] p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white/20 rounded-md backdrop-blur-sm border border-white/30" /> 
            <span className="font-extrabold italic text-lg sm:text-xl tracking-wider">{getCardBrand(cardNumber)}</span>
          </div>

          <div className="relative z-10 space-y-3 sm:space-y-4 w-full">
            <p className="font-mono text-[16px] sm:text-xl md:text-2xl tracking-[0.1em] sm:tracking-[0.15em] opacity-90 text-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {cardNumber || "**** **** **** ****"}
            </p>
            
            <div className="flex justify-between items-end gap-3 w-full">
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[8px] sm:text-[10px] text-gray-300 uppercase tracking-widest sm:tracking-wider mb-0.5 sm:mb-1 whitespace-nowrap truncate">
                  Card Holder Name
                </p>
                <p className="font-bold text-[12px] sm:text-[14px] tracking-wide truncate">
                  {cardName || "YOUR NAME"}
                </p>
              </div>
              <div className="shrink-0 text-right pl-2">
                <p className="text-[8px] sm:text-[10px] text-gray-300 uppercase tracking-widest sm:tracking-wider mb-0.5 sm:mb-1 whitespace-nowrap">
                  Expiry Date
                </p>
                <p className="font-bold text-[12px] sm:text-[14px] tracking-wide">
                  {expiryDate || "MM/YY"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CARD INPUT FIELDS --- */}
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Card Holder Name</label>
            <input 
              type="text" 
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" 
            />
          </div>
          
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Card Number</label>
            <input 
              type="text" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors font-mono" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">Expiry Date</label>
              <input 
                type="text" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" 
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-2 mb-1.5 block">CVV</label>
              <input 
                type="password" 
                defaultValue="***" 
                className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] px-4 py-3.5 text-[15px] font-medium text-gray-900 dark:text-white outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors" 
              />
            </div>
          </div>
          
          <label className="flex items-center gap-3 pt-2 cursor-pointer ml-1">
            <div className="w-5 h-5 rounded-[6px] bg-[#FC6B31] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Save Card for future payments</span>
          </label>
        </div>
      </div>

      {/* --- FIXED BOTTOM BUTTON (Add Card) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 p-4 pb-safe-offset-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => {
              setPaymentMethod("card");
              setView("summary");
            }} 
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4.5 rounded-[18px] font-bold text-[16px] hover:opacity-90 transition-opacity active:scale-[0.98]"
            style={{ padding: '1.125rem' }}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}