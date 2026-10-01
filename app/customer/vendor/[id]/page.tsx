"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Search, Star, Share2, Heart, MapPin, Clock } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import MealDetailsModal from "@/components/customer/MealDetailsModal";

export default function VendorStorefrontPage() {
  const router = useRouter();
  const params = useParams();
  
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  // --- Mock Vendor Data based on ID ---
  // In a real app, you'd fetch this using the params.id
  const vendor = {
    id: params?.id || "1",
    name: params?.id === "1" ? "The Brunch Club" : "Pizza Italiano",
    rating: 4.8,
    reviews: "1.2k+",
    deliveryTime: "30-45 min",
    coverImage: "/hero-food-illustration.png",
    logoInitial: params?.id === "1" ? "B" : "P",
  };

  const categories = ["All Items", "Popular", "Exclusive Offers", "Combos", "Drinks"];

  // --- Mock Vendor Meals ---
  const meals = [
    { id: "v1", name: "Classic Beef Burger", price: 8990, category: "Popular" },
    { id: "v2", name: "Crispy Chicken Wings", price: 6500, category: "Popular" },
    { id: "v3", name: "Loaded Fries", price: 4200, category: "Exclusive Offers" },
    { id: "v4", name: "Vanilla Milkshake", price: 3500, category: "Drinks" },
  ];

  const filteredMeals = activeCategory === "All Items" 
    ? meals 
    : meals.filter(meal => meal.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32">
      
      {/* --- TOP COVER IMAGE & HEADER --- */}
      <div className="relative h-64 w-full bg-gray-900">
        <img 
          src={vendor.coverImage} 
          alt="Vendor Cover" 
          className="w-full h-full object-cover opacity-80"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/800x400/orange/white?text=Store+Cover"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
        
        {/* Floating Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-offset-4 flex justify-between items-center z-10">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/10 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Inline Search inside Header */}
          <div className="flex-1 mx-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2.5 flex items-center gap-2 border border-white/20 shadow-sm">
            <Search className="w-4 h-4 text-white" />
            <input 
              type="text" 
              placeholder={`Search ${vendor.name}...`} 
              className="bg-transparent border-none outline-none text-white placeholder-white/80 text-[13px] w-full"
            />
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition border border-white/10 shadow-sm">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAPPING VENDOR INFO CARD --- */}
      <div className="px-4 -mt-12 relative z-20">
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-black/50 border border-gray-100 dark:border-zinc-800 flex flex-col relative">
          
          {/* Logo overlapping the card */}
          <div className="absolute -top-8 left-5 w-16 h-16 bg-white dark:bg-zinc-950 rounded-[18px] shadow-md border-4 border-white dark:border-zinc-900 flex items-center justify-center overflow-hidden z-30">
            <span className="font-extrabold text-[#FC6B31] text-2xl">{vendor.logoInitial}</span>
          </div>
          
          <div className="flex justify-between items-start mt-6">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{vendor.name}</h1>
              <div className="flex items-center gap-3 mt-1.5 text-[12px] font-medium">
                <span className="flex items-center gap-1 text-gray-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {vendor.rating} <span className="text-gray-500">({vendor.reviews})</span>
                </span>
                <div className="w-1 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" /> {vendor.deliveryTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STORE CATEGORY PILLS --- */}
      <div className="mt-6 px-4">
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                activeCategory === cat 
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md" 
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-800 hover:border-[#FC6B31]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-gray-500 mt-2 px-1 font-medium">
          Available items for your next scheduled drop
        </p>
      </div>

      {/* --- MENU GRID --- */}
      <div className="mt-5 px-4 grid grid-cols-2 gap-4">
        {filteredMeals.map((meal) => (
          <MealCard 
            key={meal.id}
            id={meal.id} 
            name={meal.name} 
            vendor={vendor.name} 
            price={meal.price} 
            onClick={() => setSelectedMeal({
              name: meal.name, 
              vendor: vendor.name, 
              originalPrice: meal.price + 1000, 
              discountedPrice: meal.price, 
              image: "/hero-food-illustration.png"
            })}
          />
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="px-4 mt-8 text-center">
          <p className="text-gray-500 text-[14px]">No items found in this category.</p>
        </div>
      )}

      {/* Modal integrates perfectly here too! */}
      <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  );
}