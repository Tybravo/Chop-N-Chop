"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, RotateCcw, PhoneCall, X, MessageSquare, ArrowLeft } from "lucide-react";
import OrderReceiptModal from "@/components/customer/OrderReceiptModal";

export default function DropsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  
  // State for controlling the receipt modal
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<any>(null);

  // State for Contact Driver Support Modal
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const handleBackNavigation = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/customer/home');
    }
  };

  // Mock active order details data structure matching the receipt schema
  const activeOrderReceiptData = {
    id: "ORD-8492",
    date: "April 17, 2026 | 12:15 PM",
    vendorName: "Taste & See Kitchen",
    deliveryAddress: "Victoria Island Corporate Tower, Lagos",
    paymentMethod: "Chop Wallet",
    status: "Out for Delivery",
    items: [
      { id: 1, name: "Smoky Party Jollof & Turkey", desc: "Extra Plantain", qty: 1, price: 4500 }
    ],
    subtotal: 4500,
    deliveryFee: 1000,
    total: 5500
  };

  const handleOpenReceipt = (orderData: any) => {
    setSelectedOrderForReceipt(orderData);
    setIsReceiptOpen(true);
  };

  const pastDrops = [
    { 
      id: "ORD-9281", 
      date: "Sep 16", 
      meal: "Smoky Jollof & Chicken (2x)", 
      vendor: "Taste & See", 
      total: "₦11,000", 
      status: "Delivered",
      subtotal: 10000,
      deliveryFee: 1000,
      paymentMethod: "Card (**** 8047)",
      address: "14 Allen Avenue, Ikeja, Lagos",
      items: [{ id: 1, name: "Smoky Jollof & Chicken", desc: "Double portion", qty: 2, price: 5000 }]
    },
    { 
      id: "ORD-9104", 
      date: "Sep 14", 
      meal: "Fluffy Yam & Eggs", 
      vendor: "Lagos Mainland Kitchen", 
      total: "₦3,500", 
      status: "Delivered",
      subtotal: 2800,
      deliveryFee: 700,
      paymentMethod: "Cash on Delivery",
      address: "14 Allen Avenue, Ikeja, Lagos",
      items: [{ id: 1, name: "Fluffy Yam & Eggs", desc: "Standard pack", qty: 1, price: 2800 }]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32 pt-4 px-4 md:px-8 selection:bg-[#FC6B31] selection:text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* TOP HEADER WITH BACK BUTTON */}
        <header className="flex items-center justify-between pt-2">
          <button 
            onClick={handleBackNavigation}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="text-center flex-1 px-4">
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Your Drops</h1>
          </div>

          {/* Spacer to keep title perfectly centered */}
          <div className="h-10 w-10" aria-hidden="true" />
        </header>

        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2 px-1">Track active deliveries and review your meal history.</p>

        {/* TABS */}
        <div className="flex bg-gray-200/50 dark:bg-zinc-900 rounded-full p-1 border border-gray-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === "active"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Active Drops (1)
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === "past"
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Past Drops
          </button>
        </div>

        {/* ACTIVE TAB CONTENT */}
        {activeTab === "active" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              
              <div className="bg-[#FC6B31] p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full block w-fit mb-2">
                    Arriving Today
                  </span>
                  <h2 className="text-lg font-extrabold leading-tight">Smoky Party Jollof & Turkey</h2>
                  <p className="text-xs text-orange-100 mt-1">Taste & See Kitchen • 1 Item</p>
                </div>
                <div className="w-full sm:w-auto bg-black/10 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="block text-[10px] font-medium text-orange-100 uppercase mb-0.5">Drop Window</span>
                  <span className="block text-xs sm:text-sm font-extrabold bg-white text-[#FC6B31] px-3 py-1.5 sm:py-1 rounded-xl shadow-sm">
                    1:30 PM - 2:00 PM
                  </span>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 dark:border-zinc-800 ml-4 space-y-8">
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Order Confirmed</h3>
                    <p className="text-xs text-gray-500 mt-1">11:00 AM • Vendor has acknowledged your pre-order.</p>
                  </div>
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <Package className="w-3 h-3 text-white" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Batching & Preparing</h3>
                    <p className="text-xs text-gray-500 mt-1">12:15 PM • Your meal is being prepared and batched for the hub drop.</p>
                  </div>
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-orange-100 dark:bg-orange-900/30 border-2 border-[#FC6B31] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <span className="w-2 h-2 bg-[#FC6B31] rounded-full animate-pulse" />
                    </span>
                    <h3 className="text-sm font-bold text-[#FC6B31]">Out for Delivery</h3>
                    <p className="text-xs text-gray-500 mt-1">Driver is currently en route to your selected hub.</p>
                  </div>
                  <div className="relative pl-8">
                    <span className="absolute -left-[13px] bg-gray-100 dark:bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
                      <MapPin className="w-3 h-3 text-gray-400" />
                    </span>
                    <h3 className="text-sm font-bold text-gray-400">Ready at Hub</h3>
                    <p className="text-xs text-gray-400 mt-1">Pending arrival at Victoria Island Corporate Tower.</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 flex gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button 
                  onClick={() => handleOpenReceipt(activeOrderReceiptData)}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-gray-900 dark:text-white"
                >
                  View Receipt
                </button>
                <button 
                  onClick={() => setIsDriverModalOpen(true)}
                  className="flex-1 bg-[#FC6B31] text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
                >
                  Contact Driver
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PAST TAB CONTENT */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastDrops.map((drop) => (
              <div key={drop.id} className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start border-b border-gray-50 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{drop.meal}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{drop.vendor} • {drop.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-extrabold text-gray-900 dark:text-white">{drop.total}</span>
                    <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-1">
                      {drop.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenReceipt(drop)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    View Receipt
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* REUSABLE RECEIPT MODAL INSTANCE */}
      {selectedOrderForReceipt && (
        <OrderReceiptModal 
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          order={selectedOrderForReceipt}
        />
      )}

      {/* CONTACT DRIVER MODAL */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] w-full max-w-sm p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Contact Delivery Driver</h3>
              <button 
                onClick={() => setIsDriverModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50 dark:bg-zinc-800 border border-orange-100 dark:border-zinc-700">
              <div className="w-12 h-12 rounded-full bg-[#FC6B31] text-white flex items-center justify-center font-black text-base shrink-0">
                <span>EM</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">Emmanuel (Rider)</h4>
                <p className="text-xs text-gray-500 truncate">Assigned to Victoria Island Hub Drop</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a 
                href="tel:+2348000000000" 
                className="w-full flex items-center justify-center gap-2 bg-[#FC6B31] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
              >
                <PhoneCall className="w-4 h-4" /> Call Driver (+234 800 000 0000)
              </a>
              <button 
                onClick={() => {
                  alert("Opening quick support chat with driver...");
                  setIsDriverModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-bold text-sm py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Send Dispatch Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}