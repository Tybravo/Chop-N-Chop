"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Clock, ChevronRight, FileText } from "lucide-react";
import OrderReceiptModal from "@/components/customer/OrderReceiptModal"; // Import your unified component

export default function OrderSuccessPage() {
  const router = useRouter();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Match the exact data structure expected by your OrderReceiptModal interface
  const orderDetails = {
    id: "ORD-8574",
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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col relative pb-8">
      <header className="px-4 py-5 flex items-center justify-between">
        <button onClick={() => router.push('/customer')} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full -mt-10 animate-in zoom-in-95 duration-500">
        
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
            <PackageCheck className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight text-center">
          Order Confirmed!
        </h1>
        <p className="text-center text-[15px] text-gray-500 mb-6 leading-relaxed max-w-[280px]">
          Your order has been placed successfully. Get ready for your delivery drop!
        </p>

        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-[20px] p-4 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wider">
              Expected Delivery
            </p>
            <p className="font-extrabold text-[15px] text-gray-900 dark:text-white tracking-tight">
              {orderDetails.deliveryWindow}
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={() => setIsReceiptOpen(true)}
            className="w-full bg-[#FC6B31] text-white py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            <FileText className="w-5 h-5" /> View E-Receipt
          </button>
          
          <button 
            onClick={() => router.push('/customer/tracking')}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Track Order <ChevronRight className="w-5 h-5" />
          </button>
        </div>
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