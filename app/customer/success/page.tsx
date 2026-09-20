"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Clock, ChevronRight, FileText, Copy, Check, UserPlus, Package, ArrowRight } from "lucide-react";
import OrderReceiptModal from "@/components/customer/OrderReceiptModal"; // Import your unified component

export default function OrderSuccessPage() {
  const router = useRouter();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Added 'pickupCode' to match the PRD requirement
  const orderDetails = {
    id: "ORD-8574",
    pickupCode: "X7B9Q2", // The 6-digit verification code
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
    status: "Confirmed & Processing"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Package className="w-3.5 h-3.5 shrink-0" />
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

        {/* 4. THE RETENTION PIVOT */}
        <div className="w-full mt-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[24px] p-6 shadow-xl relative overflow-hidden group mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FC6B31]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-[#FC6B31]" />
            </div>
            <h3 className="text-[17px] font-bold text-white mb-2 leading-tight">
              Track this order live &<br />checkout faster next time.
            </h3>
            <p className="text-[12px] text-gray-400 mb-6 leading-relaxed">
              Create an account in 10 seconds to save your delivery preferences and track your rider on the map.
            </p>
            
            <button 
              onClick={() => router.push('/customer/signup')}
              className="w-full bg-[#FC6B31] text-white py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 active:scale-[0.98]"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
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

      {/* Render the unified receipt modal component here */}
      <OrderReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={orderDetails}
      />
    </div>
  );
}