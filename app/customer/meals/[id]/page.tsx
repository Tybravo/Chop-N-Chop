"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, Package } from "lucide-react";

export default function FoodDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  // --- Interactive States ---
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // --- Pre-packed Dish Data (No sizes or variant modifications) ---
  const meal = {
    id: params?.id || "meal-1",
    name: "Melting Cheese Pizza",
    vendor: "Pizza Italiano",
    rating: 4.8,
    reviews: "2.2k",
    price: 10990,
    image: "/hero-food-illustration.png", 
    description: "Our signature pre-packed artisan pizza loaded with rich melting cheese, freshly prepared for guaranteed delivery windows.",
    packContents: [
      "10-inch artisan crust",
      "Special blend mozzarella & cheddar cheese",
      "Signature house tomato base",
      "Fresh herbs & seasoning"
    ]
  };

  const totalPrice = meal.price * quantity;

  const handleAddToCart = () => {
    // TODO: Add to global cart state/backend
    console.log(`Added ${quantity}x ${meal.name} to cart`);
    router.push('/customer/cart');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-32">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"}`} />
          </button>
          <button className="p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Share2 className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>
      </header>

      {/* --- FOOD IMAGE HERO --- */}
      <div className="w-full flex justify-center py-6 px-4">
        <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
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
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {meal.name}
          </h1>
          <span className="text-xl md:text-2xl font-extrabold text-[#FC6B31] shrink-0 mt-0.5">
            ₦{meal.price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium mb-6">
          <span className="text-gray-500 flex items-center gap-1.5">
            <span className="text-[#FC6B31]">🏪</span> {meal.vendor}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {meal.rating} <span className="text-gray-400">({meal.reviews})</span>
          </span>
        </div>

        {/* --- DESCRIPTION --- */}
        <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          {meal.description}
        </p>

        {/* --- WHAT'S IN THE PACK --- */}
        <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-[20px] p-5 border border-gray-100 dark:border-zinc-800">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#FC6B31]" />
            What's inside this pack
          </h3>
          <ul className="space-y-3">
            {meal.packContents.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-[14px] text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FC6B31] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- FIXED BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 p-4 pb-safe-offset-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 px-4 py-3.5 border-2 border-gray-100 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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

          {/* Add to Cart Button (Using your brand #FC6B31 color) */}
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-[#FC6B31] hover:bg-orange-600 transition-colors text-white py-4 px-6 rounded-full font-bold text-[15px] flex items-center justify-between shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            <span>Add to Cart</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </button>
          
        </div>
      </div>

    </div>
  );
}