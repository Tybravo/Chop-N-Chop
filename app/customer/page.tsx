"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Search, Star, ShoppingCart } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealDetailsModal from "@/components/customer/MealDetailsModal"; // NEW IMPORT

export default function CustomerHome() {
  const [notificationCount, setNotificationCount] = useState(0);
  
  // NEW STATE: Controls which meal is currently selected for the modal
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  useEffect(() => {
    // Simulated notification count from your Figma design
    setNotificationCount(2); 
  }, []);

  const categories = [
    { name: "Rice", icon: "🍛" },
    { name: "Fast Food", icon: "🍔" },
    { name: "Soup", icon: "🍲" },
    { name: "Proteins", icon: "🍗" },
    { name: "Drinks", icon: "🥤" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full relative pb-32">
      
      {/* =========================================
          1. MOBILE HEADER 
      ========================================= */}
      <header className="md:hidden flex items-start justify-between pt-1">
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-0.5">
            Hello, John-Daniel <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform">👋</span>
          </h1>
          <div className="flex items-center gap-1 cursor-pointer w-fit text-gray-500 hover:text-[#FC6B31] transition-colors">
            <span className="text-[13px] font-medium">Ikeja, Lagos</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0 pt-1 relative z-20">
          <ThemeToggle />
          
          <button className="relative p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
            {notificationCount > 0 && (
              <span className="absolute top-0.5 right-1 bg-[#FC6B31] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 shadow-sm">
                {notificationCount}
              </span>
            )}
          </button>
          
          <Link href="/customer/cart" className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-900 dark:text-white" />
          </Link>
        </div>
      </header>

      {/* =========================================
          2. BANNER 
      ========================================= */}
      <div className="md:hidden w-full">
        <DeliveryDropBanner />
      </div>

      {/* Desktop Hero (Hidden on Mobile) */}
      <div className="hidden md:flex relative z-10 bg-[#FC6B31] rounded-t-[2.5rem] pt-12 pb-32 px-12 lg:px-20 items-center justify-between w-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)" }}>
        {/* ... Desktop Hero remains unchanged ... */}
      </div>

      {/* =========================================
          3. SEARCH BAR
      ========================================= */}
      <div className="w-full md:hidden">
        <div className="flex items-center gap-2.5 w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-900/50 rounded-[12px] text-gray-400 border border-gray-100 dark:border-zinc-800 focus-within:border-gray-200 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search meals or vendors..." 
            className="bg-transparent border-none outline-none w-full text-[14px] text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* =========================================
          4. BROWSE CATEGORIES 
      ========================================= */}
      <section className="space-y-4 md:mt-16 w-full">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-[17px] md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Browse Categories</h2>
        </div>
        
        <div className="flex md:flex-row gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 md:mx-0 md:px-0 w-auto md:w-full md:justify-center">
          {categories.map((cat) => (
            <button key={cat.name} className="group flex flex-col items-center gap-2.5 shrink-0 transition-all hover:-translate-y-1">
              <div className="text-3xl md:text-5xl w-[72px] h-[72px] md:w-20 md:h-20 bg-white dark:bg-zinc-900 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-black/30 rounded-[18px] flex items-center justify-center border-2 border-transparent transition-all group-hover:border-[#FC6B31]">
                {cat.icon}
              </div>
              <span className="text-[12px] md:text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#FC6B31] transition-colors">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================
          5. BEST SELLERS (Mobile Carousel)
      ========================================= */}
      <section className="space-y-4 md:mt-24 w-full">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-[17px] md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Best Sellers</h2>
          <Link href="/customer/explore" className="text-[13px] font-medium text-[#FC6B31] hover:text-orange-600 transition-colors">
            See All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 gap-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible w-auto md:w-full snap-x snap-mandatory">
          
          <div className="w-[calc(50vw-16px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
            <MealCard 
              id="meal-1" 
              name="Melting Cheese Pizza" 
              vendor="Pizza Italiano" 
              price={10990} 
              // NEW: Trigger the modal with mock data
              onClick={() => setSelectedMeal({
                name: "Melting Cheese Pizza",
                vendor: "Pizza Italiano",
                originalPrice: 12990,
                discountedPrice: 10990,
                image: "/hero-food-illustration.png"
              })}
            />
          </div>

          <div className="w-[calc(50vw-16px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
            <MealCard 
              id="meal-2" 
              name="Cheese Burger" 
              vendor="Burger Hunt" 
              price={4990} 
              onClick={() => setSelectedMeal({
                name: "Cheese Burger",
                vendor: "Burger Hunt",
                originalPrice: 5500,
                discountedPrice: 4990,
                image: "/hero-food-illustration.png"
              })}
            />
          </div>

          <div className="w-[calc(50vw-16px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
            <MealCard 
              id="meal-3" 
              name="Smoky Jollof & Chicken" 
              vendor="Taste & See" 
              price={5000} 
              onClick={() => setSelectedMeal({
                name: "Smoky Jollof & Chicken",
                vendor: "Taste & See",
                originalPrice: 6500,
                discountedPrice: 5000,
                image: "/hero-food-illustration.png"
              })}
            />
          </div>

          <div className="w-[calc(50vw-16px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
            <MealCard 
              id="meal-4" 
              name="Beef Stir Fry Pasta" 
              vendor="The Brunch Club" 
              price={4200} 
              onClick={() => setSelectedMeal({
                name: "Beef Stir Fry Pasta",
                vendor: "The Brunch Club",
                originalPrice: 5000,
                discountedPrice: 4200,
                image: "/hero-food-illustration.png"
              })}
            />
          </div>
          
        </div>
      </section>

      {/* =========================================
          THE NEW DETAILS MODAL
      ========================================= */}
      <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />

    </div>
  );
}