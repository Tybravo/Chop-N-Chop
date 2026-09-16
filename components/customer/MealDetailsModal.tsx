"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Clock, Package, BadgeCheck, ChevronRight } from "lucide-react";

interface MealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: {
    name: string;
    vendor: string;
    originalPrice: number;
    discountedPrice: number;
    image: string;
  } | null;
}

export default function MealDetailsModal({ isOpen, onClose, meal }: MealDetailsModalProps) {
  // --- Drag to Dismiss State ---
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  // Reset drag state when modal opens/closes
  useEffect(() => {
    if (!isOpen) setDragY(0);
  }, [isOpen]);

  if (!isOpen || !meal) return null;

  // --- Touch Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const delta = currentY - startY.current;
    
    // Only allow dragging downwards
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged down more than 100px, close the modal
    if (dragY > 100) {
      onClose();
    } else {
      // Otherwise, snap it back to the top
      setDragY(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-end">
      
      {/* Dark Overlay (Click to close) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Modal Container with Drag Transforms */}
      <div 
        className={`relative w-full max-w-md mx-auto z-10 flex flex-col ${
          !isDragging ? "transition-transform duration-300 ease-out" : ""
        } ${dragY === 0 && !isDragging ? "animate-in slide-in-from-bottom-[100%]" : ""}`}
        style={{ transform: `translateY(${dragY}px)` }}
      >
        
        {/* Drag Handle (Touch target area 1) */}
        <div 
          className="flex justify-center mb-16 relative z-40 shrink-0 py-4 touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-white/50 rounded-full" />
        </div>

        {/* Main Sheet */}
        <div className="bg-white dark:bg-zinc-950 rounded-t-[2.5rem] flex flex-col relative h-[85vh]">
          
          {/* Overlapping Image (Touch target area 2) */}
          <div 
            className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-[5px] border-white dark:border-zinc-950 bg-white shadow-xl overflow-hidden z-40 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={meal.image} 
              alt={meal.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/orange/white?text=Food"; }}
            />
          </div>

          {/* --- TOP ORANGE HEADER --- */}
          {/* Added shadow-md and z-30 here. This makes the white content scroll UNDER this banner! */}
          <div 
            className="bg-[#FC6B31] rounded-t-[2.5rem] pt-16 pb-6 px-6 flex flex-col items-center relative shrink-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.1)] touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <h2 className="text-white text-xl font-extrabold text-center mt-2 tracking-tight">
              {meal.name}
            </h2>
            <div className="flex items-center gap-1.5 text-orange-50 text-[13px] font-medium mt-1">
              {meal.vendor} 
              <BadgeCheck className="w-4 h-4 fill-white text-[#FC6B31]" />
            </div>
          </div>

          {/* --- SCROLLABLE BODY --- */}
          {/* We do NOT put touch handlers here, so the user can scroll normally without dragging the modal */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 pb-28 no-scrollbar relative z-10">
            
            {/* Details */}
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">Details</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Savor the tasty mix in our Stir Fry Spaghetti! This quick meal features al dente spaghetti, fresh veggies, tender chicken, and a savory sauce - satisfying and nutritious! 
                {/* Adding extra mock text to ensure it's long enough to scroll */}
                Every batch is made fresh daily by our vetted neighborhood kitchens, ensuring you get the perfect temperature and taste upon delivery.
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-gray-500 font-medium mb-1">Price</p>
                <p className="text-[16px] font-bold text-gray-400 line-through">
                  ₦{meal.originalPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium mb-1">Discounted Price</p>
                <p className="text-[16px] font-extrabold text-gray-900 dark:text-white">
                  ₦{meal.discountedPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-3">What's Included?</h3>
              <ul className="space-y-3">
                {['4 scoops of Jollof Rice', 'Whole Chicken', 'Special Soy Sause Dipping', 'Extra Coleslaw', 'Fried Plantains'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-gray-300 font-medium">
                    <Check className="w-4 h-4 text-gray-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-4 flex gap-3 items-center border border-gray-100 dark:border-zinc-800">
                <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium">Preparation Time</span>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">30mins-1hr</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-4 flex gap-3 items-center border border-gray-100 dark:border-zinc-800">
                <Package className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium">Servings Left</span>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">100</span>
                </div>
              </div>
            </div>

          </div>

          {/* --- FIXED BOTTOM BUTTON --- */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-950 border-t border-gray-50 dark:border-zinc-900 pb-safe-offset-4 z-40">
            <button className="w-full bg-[#FC6B31] text-white font-bold py-4 rounded-full flex justify-center items-center gap-2 hover:bg-orange-600 transition-colors active:scale-95 shadow-lg shadow-orange-500/25">
              Pay ₦{meal.discountedPrice.toLocaleString()} <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}