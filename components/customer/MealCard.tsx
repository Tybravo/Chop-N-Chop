"use client";

import { Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; // Import your global cart store

interface MealCardProps {
  id: string | number;
  name: string;
  vendor: string;
  price: number;
  imageUrl?: string;
  onClick?: () => void;
}

export default function MealCard({ id, name, vendor, price, imageUrl, onClick }: MealCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the card from opening the modal when clicking the '+' button
    addToCart({
      id: id,
      name: name,
      desc: `${vendor} • Standard`,
      price: price,
      image: imageUrl || "/hero-food-illustration.png",
    });
  };

  return (
    <button onClick={onClick} className="block group h-full w-full text-left">
      <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-black/30 border border-gray-50 dark:border-zinc-800 transition-all group-hover:shadow-md relative flex flex-col h-full w-full">
        
        <div className="w-full aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl mb-3 flex items-center justify-center overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <span className="text-2xl font-bold text-gray-300 dark:text-zinc-700">Food</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-[#FC6B31] transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{vendor}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="font-extrabold text-[15px] text-gray-900 dark:text-white">
              ₦{price.toLocaleString()}
            </span>
            
            <div 
              onClick={handleQuickAdd}
              className="w-8 h-8 rounded-full bg-[#FC6B31] flex items-center justify-center text-white shadow-sm hover:bg-orange-600 transition-colors active:scale-95 shrink-0"
              title="Quick Add to Cart"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}