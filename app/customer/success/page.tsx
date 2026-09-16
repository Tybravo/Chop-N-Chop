"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, QrCode, PackageCheck, Copy, ChevronRight } from "lucide-react"; // Swapped Download for Share2

export default function OrderSuccessPage() {
  const router = useRouter();
  const [view, setView] = useState<"success" | "receipt">("success");

  // --- Mock Order Details ---
  const orderDetails = {
    id: "#TR8574KHTG",
    date: "April 12, 2026 | 07:30 PM",
    customer: "John-Daniel Ikechukwu",
    paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Melting Cheese Pizza", desc: "8'' Small", qty: 1, price: 11880 },
      { id: 2, name: "Chicken Salad", desc: "Medium", qty: 2, price: 9120 }
    ],
    subtotal: 21000,
    delivery: 1500,
    total: 22500,
  };

  // --- Native Share Handler ---
  const handleShareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChopNChop E-Receipt',
          text: `Here is my ChopNChop order receipt for ${orderDetails.id}`,
          url: window.location.href, 
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for desktop browsers that don't support native sharing
      alert("Share menu opened! (Native share sheet will appear on mobile devices)");
    }
  };

  // ==========================================
  // VIEW 1: SUCCESS SPLASH SCREEN
  // ==========================================
  if (view === "success") {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex flex-col relative pb-8">
        <header className="px-4 py-5 flex items-center justify-between">
          <button onClick={() => router.push('/customer')} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full -mt-10 animate-in zoom-in-95 duration-500">
          {/* Celebratory Icon */}
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
              <PackageCheck className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight text-center">
            Order Confirmed!
          </h1>
          <p className="text-center text-[15px] text-gray-500 mb-10 leading-relaxed max-w-[280px]">
            Your order has been placed successfully. Get ready for your delivery drop!
          </p>

          <div className="w-full space-y-4">
            <button 
              onClick={() => setView("receipt")}
              className="w-full bg-[#FC6B31] text-white py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              style={{ padding: '1.125rem' }}
            >
              View E-Receipt
            </button>
            <button 
              onClick={() => router.push('/customer')}
              className="w-full bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white py-4.5 rounded-[18px] font-bold text-[16px] flex justify-center items-center hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              style={{ padding: '1.125rem' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: E-RECEIPT & QR CODE
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32 animate-in slide-in-from-bottom-8 duration-300">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
        <button onClick={() => setView("success")} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">E-Receipt</h1>
        
        {/* NATIVE SHARE BUTTON */}
        <button 
          onClick={handleShareReceipt}
          className="p-2 -mr-2 text-gray-900 dark:text-white hover:text-[#FC6B31] rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="px-5 md:px-8 max-w-[400px] mx-auto pt-6">
        
        {/* --- RECEIPT TICKET --- */}
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-black/40 border border-gray-100 dark:border-zinc-800 overflow-hidden relative">
          
          {/* Barcode Section */}
          <div className="p-6 pb-8 flex flex-col items-center border-b-[2px] border-dashed border-gray-200 dark:border-zinc-800 relative">
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-50/50 dark:bg-zinc-950 rounded-full border-r border-gray-100 dark:border-zinc-800" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50/50 dark:bg-zinc-950 rounded-full border-l border-gray-100 dark:border-zinc-800" />
            
            <QrCode className="w-24 h-24 text-gray-900 dark:text-white mb-3" strokeWidth={1} />
            <p className="font-mono text-xl tracking-[0.2em] font-bold text-gray-900 dark:text-white">
              {orderDetails.id.replace('#', '')}
            </p>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Show this to the driver</p>
          </div>

          {/* Items Section */}
          <div className="p-6 space-y-4">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-[12px] text-gray-500">{item.desc} • Qty: {item.qty}</p>
                </div>
                <span className="font-extrabold text-[14px] text-gray-900 dark:text-white">₦{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="px-6">
            <div className="w-full h-px bg-gray-100 dark:bg-zinc-800" />
          </div>

          {/* Pricing Breakdown */}
          <div className="p-6 space-y-3 bg-gray-50/30 dark:bg-zinc-900/50">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">₦{orderDetails.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">₦{orderDetails.delivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[16px] pt-2">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-extrabold text-[#FC6B31]">₦{orderDetails.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Order Meta Info */}
          <div className="p-6 space-y-4 bg-gray-100 dark:bg-zinc-950/50">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-500">Order Date</span>
              <span className="text-[13px] font-bold text-gray-900 dark:text-white">{orderDetails.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-500">Payment Method</span>
              <span className="text-[13px] font-bold text-gray-900 dark:text-white">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-500">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-gray-900 dark:text-white">{orderDetails.id}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(orderDetails.id)}
                  className="text-gray-400 hover:text-[#FC6B31] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* --- FIXED BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 p-4 pb-safe-offset-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => router.push('/customer/tracking')} 
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4.5 rounded-[18px] font-bold text-[16px] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ padding: '1.125rem' }}
          >
            Track Order <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}