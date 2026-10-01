"use client";

import { useRef, useState } from "react";
import { X, Download, CheckCircle2, Share2, Loader2, MessageCircle, Send, Mail } from "lucide-react";

interface ReceiptItem {
  id: string | number;
  name: string;
  desc?: string;
  qty: number;
  price: number;
  vendorName?: string;
}

interface OrderReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    date: string;
    items: ReceiptItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    vendorName?: string;
    vendor?: string;
    deliveryAddress?: string;
    address?: string;
    paymentMethod: string;
    status: string;
  };
}

export default function OrderReceiptModal({ isOpen, onClose, order }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // --- Direct App Share Handlers ---
  const receiptMessage = 
    `🧾 *ChopnChop Order Receipt* - ${order.id}\n` +
    `• Merchant: ChopnChop Global\n` +
    `• Total Amount: ₦${order.total.toLocaleString()}\n` +
    `• Status: Verified Transaction ✅\n` +
    `• Date: ${order.date}`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(receiptMessage)}`;
    window.open(url, "_blank");
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(receiptMessage)}`;
    window.open(url, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`ChopnChop Receipt - ${order.id}`);
    const body = encodeURIComponent(`Hello,\n\nHere are the details for my confirmed order:\n\n${receiptMessage.replace(/[*_]/g, '')}\n\nThank you for using ChopnChop!`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleGenericShare = async () => {
    setIsSharing(true);
    const shareData = {
      title: `ChopnChop Receipt - ${order.id}`,
      text: receiptMessage.replace(/[*_]/g, ''),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleShareWhatsApp();
      }
    } catch (err) {
      console.log("Sharing cancelled or unsupported:", err);
    } finally {
      setIsSharing(false);
    }
  };

  const defaultVendor = order.vendorName || order.vendor || "ChopnChop Kitchen";
  
  const groupedItems = order.items.reduce((acc, item) => {
    const vName = item.vendorName || defaultVendor;
    if (!acc[vName]) {
      acc[vName] = [];
    }
    acc[vName].push(item);
    return acc;
  }, {} as Record<string, ReceiptItem[]>);

  const vendorKeys = Object.keys(groupedItems);
  const isMultiVendor = vendorKeys.length > 1;
  const addressText = order.deliveryAddress || order.address;

  return (
    <>
      <style jsx global>{`
        body:has(#printable-receipt-portal) > *:not(#printable-receipt-portal) {
          visibility: hidden !important;
        }
        #printable-receipt-portal, #printable-receipt-portal * {
          visibility: visible !important;
        }
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: #ffffff !important;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            width: 400px;
            margin: 0;
            padding: 24px;
            border-radius: 20px !important;
            box-shadow: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div id="printable-receipt-portal" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
        
        <div className="w-full max-w-md my-auto flex flex-col">
          
          {/* THE RECEIPT SLIP CARD */}
          <div 
            id="printable-receipt"
            ref={receiptRef}
            className="w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col p-6 sm:p-8 space-y-6 text-left font-sans"
          >
            
            <div className="text-center pb-6 border-b border-dashed border-gray-200 dark:border-zinc-800 space-y-3">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50 dark:ring-emerald-950/20">
                <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Successful</h4>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">₦{order.total.toLocaleString()}</h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Transaction
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
                <span className="text-gray-400 font-medium">Merchant</span>
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <img src="/logo_icon.png" alt="CNC" className="w-4 h-4 object-contain" /> ChopnChop Global
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
                <span className="text-gray-400 font-medium">Order Reference</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{order.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
                <span className="text-gray-400 font-medium">Transaction Time</span>
                <span className="font-semibold text-gray-900 dark:text-white">{order.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
                <span className="text-gray-400 font-medium">Payment Source</span>
                <span className="font-semibold text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
             {addressText && (
                <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60 items-start gap-4">
                  <span className="text-gray-400 font-medium shrink-0">Destination</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right line-clamp-2 max-w-[220px]">
                    {addressText}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-2">
                Item Breakdown {isMultiVendor && "(Multi-Vendor)"}
              </div>

              {vendorKeys.map((vendor) => (
                <div key={vendor} className="space-y-3">
                  {isMultiVendor && (
                    <div className="bg-orange-50 dark:bg-zinc-800/60 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-[#FC6B31] tracking-wide mt-2">
                      Kitchen: {vendor}
                    </div>
                  )}

                  {groupedItems[vendor].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs gap-4">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{item.name}</span>
                        <span className="text-[11px] text-gray-400">Qty: {item.qty} {item.desc ? `• ${item.desc}` : ""}</span>
                      </div>
                      <span className="font-extrabold text-gray-900 dark:text-white shrink-0">
                        ₦{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">₦{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-zinc-800">
                <span>Total Amount</span>
                <span className="text-[#FC6B31] text-base">₦{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 text-center space-y-2">
              <div className="font-mono tracking-[0.3em] text-[10px] text-gray-400">
                ||| | |||| || | |||||| |||| | ||
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Thank you for choosing ChopnChop!</p>
            </div>

          </div>

          {/* Action Footer with Centralized App Icons & Icon-Only PDF Save Button */}
          <div className="no-print mt-3 flex items-center justify-between gap-2">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Centralized Quick Share Icons */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button 
                onClick={handleShareWhatsApp}
                className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Share to WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={handleShareTelegram}
                className="w-10 h-10 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Share to Telegram"
              >
                <Send className="w-4 h-4" />
              </button>
              <button 
                onClick={handleShareEmail}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Share via Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button 
                onClick={handleGenericShare}
                disabled={isSharing}
                className="w-10 h-10 rounded-xl bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-50"
                title="More Apps / System Share"
              >
                {isSharing ? <Loader2 className="w-4 h-4 animate-spin text-[#FC6B31]" /> : <Share2 className="w-4 h-4 text-[#FC6B31]" />}
              </button>
            </div>

            {/* Save PDF Action Button (Icon Only) */}
            <button 
              onClick={handlePrint}
              className="w-12 h-12 rounded-2xl bg-[#FC6B31] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform active:scale-95 shrink-0"
              title="Save PDF"
            >
              <Download className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>
    </>
  );
}