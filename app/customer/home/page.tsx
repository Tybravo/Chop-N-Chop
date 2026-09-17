"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealDetailsModal from "@/components/customer/MealDetailsModal"; 
import TodaysDealsSection from "@/components/customer/TodaysDealsSection"; 

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
          1. MOBILE HEADER (Avatar & Welcome Style) 
      ========================================= */}
      <header className="md:hidden flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {/* Avatar Circular Image */}
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-100 dark:border-zinc-800">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDaniel&backgroundColor=f3f4f6" 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-gray-500 font-medium">Welcome Back</span>
            <h1 className="text-[16px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              John-Daniel
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button className="relative p-2.5 rounded-full border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1.5 bg-[#FC6B31] w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950" />
            )}
          </button>
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
          4. BROWSE CATEGORIES (Pill Style)
      ========================================= */}
      <section className="space-y-4 md:mt-16 w-full">
        <div className="flex justify-between items-center mb-2 px-4 md:px-0">
          <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h2>
          <Link href="/customer/explore" className="text-[13px] font-bold text-gray-500 hover:text-[#FC6B31] transition-colors">
            See all
          </Link>
        </div>
        
        {/* Removed negative margins, added clean consistent padding */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 px-4 md:px-0">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FC6B31] text-white shadow-md shadow-orange-500/20 shrink-0">
            <span className="font-bold text-[13px]">All</span>
          </button>
          
          {[
            { name: "Burger", icon: "🍔" },
            { name: "Fruits", icon: "🍎" },
            { name: "Pizza", icon: "🍕" },
            { name: "Drinks", icon: "🥤" },
          ].map((cat) => (
            <button key={cat.name} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-gray-300 shrink-0 hover:border-[#FC6B31] transition-colors">
              <span className="text-[14px]">{cat.icon}</span>
              <span className="font-bold text-[13px]">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================
          5. BEST SELLERS (Mobile Carousel)
      ========================================= */}
      <section className="space-y-4 md:mt-24 w-full">
        <div className="flex justify-between items-end mb-2 px-4 md:px-0">
          <h2 className="text-[17px] md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Best Sellers</h2>
          <Link href="/customer/explore" className="text-[13px] font-medium text-[#FC6B31] hover:text-orange-600 transition-colors">
            See All
          </Link>
        </div>
        
        {/* Removed negative margins here too */}
        <div className="flex overflow-x-auto no-scrollbar pb-6 px-4 gap-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible w-auto md:w-full snap-x snap-mandatory">
          
          <div className="w-[calc(50vw-24px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
            <MealCard 
              id="meal-1" 
              name="Melting Cheese Pizza" 
              vendor="Pizza Italiano" 
              price={10990} 
              onClick={() => setSelectedMeal({
                name: "Melting Cheese Pizza",
                vendor: "Pizza Italiano",
                originalPrice: 12990,
                discountedPrice: 10990,
                image: "/hero-food-illustration.png"
              })}
            />
          </div>

          <div className="w-[calc(50vw-24px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
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

          <div className="w-[calc(50vw-24px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
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

          <div className="w-[calc(50vw-24px)] sm:w-[180px] shrink-0 snap-start md:w-auto md:shrink">
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

      {/* TODAY'S DEALS REUSABLE COMPONENT */}
      <TodaysDealsSection onSelectMeal={setSelectedMeal} />

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