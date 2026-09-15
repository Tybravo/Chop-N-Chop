"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, Check } from "lucide-react";

export default function FoodDetailsPage() {
  const router = useRouter();
  
  // --- Interactive States ---
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  // --- Mock Data (Would typically fetch this based on the [id] param) ---
  const meal = {
    name: "Melting Cheese Pizza",
    vendor: "Pizza Italiano",
    rating: 4.8,
    reviews: "2.2k",
    image: "/hero-food-illustration.png", // Using your existing placeholder
    sizes: [
      { name: "Small", price: 8900, sizeText: "8''" },
      { name: "Medium", price: 10990, sizeText: "10''" },
      { name: "Large", price: 12990, sizeText: "12''" },
    ],
    addons: [
      { id: 1, name: "Chicken", amount: "250 gm", price: 1400, icon: "🍗" },
      { id: 2, name: "Mushroom", amount: "50 gm", price: 500, icon: "🍄" },
      { id: 3, name: "Extra Cheese", amount: "100 gm", price: 800, icon: "🧀" },
    ]
  };

  // --- Price Calculation ---
  const currentSizePrice = meal.sizes.find(s => s.name === selectedSize)?.price || 0;
  const addonsTotal = selectedAddons.reduce((total, addonId) => {
    const addon = meal.addons.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);
  const totalPrice = (currentSizePrice + addonsTotal) * quantity;

  // --- Handlers ---
  const toggleAddon = (id: number) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(aId => aId !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-32">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"}`} />
          </button>
          <button className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>
      </header>

      {/* --- FOOD IMAGE HERO --- */}
      <div className="w-full flex justify-center py-6 px-4">
        <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
          {/* Soft glow behind the food */}
          <div className="absolute inset-0 bg-[#FC6B31]/10 rounded-full blur-3xl scale-90" />
          <img 
            src={meal.image} 
            alt={meal.name} 
            className="w-full h-full object-cover rounded-full drop-shadow-2xl relative z-10"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/orange/white?text=Food"; }}
          />
        </div>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="px-5 md:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          {meal.name}
        </h1>
        
        <div className="flex items-center gap-4 text-sm font-medium mb-6">
          <span className="text-gray-500 flex items-center gap-1.5">
            <span className="text-[#FC6B31]">🏪</span> {meal.vendor}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {meal.rating} <span className="text-gray-400">({meal.reviews})</span>
            <span className="text-gray-400 ml-1">&gt;</span>
          </span>
        </div>

        {/* --- SIZE SELECTOR --- */}
        <div className="flex items-center justify-between gap-3 mb-8">
          {meal.sizes.map((size) => {
            const isSelected = selectedSize === size.name;
            return (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                className={`flex-1 py-3 px-2 rounded-[16px] border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected 
                    ? "border-[#FC6B31] bg-orange-50/50 dark:bg-[#FC6B31]/10" 
                    : "border-gray-100 dark:border-zinc-800 bg-transparent hover:border-gray-200"
                }`}
              >
                {/* Radio dot indicator */}
                <div className={`w-4 h-4 rounded-full border-[4px] mb-1 ${
                  isSelected ? "border-[#FC6B31] bg-white" : "border-gray-200 dark:border-zinc-700 bg-transparent"
                }`} />
                <span className={`text-[11px] uppercase tracking-wider font-bold ${isSelected ? "text-[#FC6B31]" : "text-gray-400"}`}>
                  {size.sizeText} {size.name}
                </span>
                <span className={`text-[13px] font-bold ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                  ₦{size.price.toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>

        {/* --- INGREDIENTS / ADD-ONS --- */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Ingredients</h3>
        <div className="space-y-3">
          {meal.addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div 
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`flex items-center justify-between p-3 rounded-[16px] border transition-all cursor-pointer ${
                  isSelected 
                    ? "border-[#FC6B31] bg-orange-50/30 dark:bg-[#FC6B31]/5" 
                    : "border-gray-100 dark:border-zinc-800 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    {addon.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight">{addon.name}</span>
                    <span className="text-[12px] text-gray-500 font-medium">
                      {addon.amount} • <span className="text-[#FC6B31]">+₦{addon.price.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
                
                {/* Custom Checkbox */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#FC6B31] text-white" : "bg-gray-100 dark:bg-zinc-800 text-transparent"
                }`}>
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- FIXED BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 p-4 pb-safe-offset-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 px-4 py-3.5 border-2 border-gray-100 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-bold text-[15px] w-4 text-center text-gray-900 dark:text-white">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-400 hover:text-[#FC6B31] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="flex-1 bg-[#FC6B31] hover:bg-orange-600 transition-colors text-white py-4 px-6 rounded-full font-bold text-[15px] flex items-center justify-between shadow-lg shadow-orange-500/20 active:scale-[0.98]">
            <span>Add to Cart</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </button>
          
        </div>
      </div>

    </div>
  );
}