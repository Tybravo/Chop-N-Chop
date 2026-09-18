"use client";

import { useState, useEffect } from "react";
import { X, Heart, Share2, Minus, Plus } from "lucide-react";

interface MealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: { name: string; vendor: string; originalPrice: number; discountedPrice: number; image: string; } | null;
}

export default function MealDetailsModal({ isOpen, onClose, meal }: MealDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isOpen) setQuantity(1); // Reset on close
  }, [isOpen]);

  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-end">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-auto animate-in slide-in-from-bottom-[100%] duration-300 z-10 flex flex-col h-[85vh] bg-white dark:bg-zinc-950 rounded-t-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* --- EDGE-TO-EDGE TOP IMAGE --- */}
        <div className="relative w-full h-[280px] shrink-0 bg-gray-100 dark:bg-zinc-900 rounded-b-[2rem] overflow-hidden">
          <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
          
          {/* Top Actions ('X' to close, Share, Heart) */}
          <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent pt-safe-offset-4">
            <button onClick={onClose} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:scale-105 transition shadow-sm">
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:scale-105 transition shadow-sm">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:scale-105 transition shadow-sm">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE DETAILS --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28 no-scrollbar">
          
          <div>
            <div className="flex justify-between items-start gap-4 mb-1">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{meal.name}</h2>
              <span className="text-[13px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
                🔥 271 Cal
              </span>
            </div>
            <p className="text-[13px] text-[#FC6B31] font-medium">$0 Delivery fee over ₦26,000</p>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              A comprehensive mix of ingredients perfect for your scheduled drop. Enjoy fresh and high-quality meals sourced from top vendors, perfectly packed for guaranteed delivery windows.
            </p>

            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-3">What's Inside</h3>
            <ul className="text-[13px] text-gray-500 leading-relaxed space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FC6B31] rounded-full"/> 1 Juicy beef patty</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FC6B31] rounded-full"/> 1 Slice of cheddar cheese</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FC6B31] rounded-full"/> 1 burger bun & Fresh lettuce</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FC6B31] rounded-full"/> Ripe tomato slices & Pickles</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#FC6B31] rounded-full"/> Ketchup, Mustard, Onions and bacon</li>
            </ul>
          </div>
        </div>

        {/* --- FIXED BOTTOM BAR --- */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 pb-safe-offset-4 flex gap-4">
          
          {/* Reduce/Add Pill */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-zinc-900 rounded-full px-2 w-[120px] shrink-0 h-[56px]">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors">
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <span className="font-bold text-[15px] text-gray-900 dark:text-white">{quantity.toString().padStart(2, '0')}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[#FC6B31] transition-colors">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="flex-1 bg-[#FC6B31] text-white font-bold rounded-full flex justify-between items-center px-6 h-[56px] hover:bg-orange-600 transition-colors active:scale-[0.98] shadow-lg shadow-orange-500/20">
            <span>Add to cart</span>
            <span>₦{(meal.discountedPrice * quantity).toLocaleString()}</span>
          </button>
        </div>

      </div>
    </div>
  );
}