"use client";

import Link from "next/link";
import { Bell, ChevronDown, Search, ArrowRight, Star, ShoppingBag } from "lucide-react";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealCard from "@/components/customer/MealCard";

export default function CustomerHome() {
  const categories = [
    { name: "Rice", icon: "🍛", bg: "bg-orange-50" },
    { name: "Pasta", icon: "🍝", bg: "bg-yellow-50" },
    { name: "Proteins", icon: "🍗", bg: "bg-red-50" },
    { name: "Soups", icon: "🍲", bg: "bg-green-50" },
    { name: "Healthy", icon: "🥗", bg: "bg-emerald-50" },
    { name: "Drinks", icon: "🥤", bg: "bg-blue-50" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* --- MOBILE ONLY: Header & Search --- */}
      <header className="md:hidden flex items-center justify-between pt-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Hello, Daniel 👋</h1>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition">
            <span>Ikeja, Lagos</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      <div className="md:hidden">
        <Link href="/customer/explore" className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-400 text-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <span>Search meals or vendors...</span>
        </Link>
      </div>

      {/* --- RESPONSIVE HERO SECTION --- */}
      {/* Mobile view uses the component we built earlier */}
      <div className="md:hidden">
        <DeliveryDropBanner />
      </div>

      {/* Desktop view uses the large clipped layout */}
      <div 
        className="hidden md:flex relative bg-orange-500 rounded-t-[2.5rem] pt-12 pb-24 px-12 lg:px-20 items-center justify-between"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 55% 100%, 0 88%)" }}
      >
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-xl text-white space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider uppercase border border-white/30">
            ⚡ Scheduled Delivery Window
          </span>
          <h1 className="text-5xl font-extrabold leading-tight">Fresh Cooked <br /> Meals, Daily.</h1>
          <p className="text-orange-50 text-base max-w-md">Discover curated neighborhood kitchens. We consolidate your multi-vendor orders for guaranteed fresh delivery windows.</p>
        </div>

        <div className="relative z-10 lg:mr-12">
          <div className="w-[300px] h-[300px] bg-orange-400 rounded-full flex items-center justify-center relative border-4 border-white shadow-2xl">
            <img 
              src="/hero-food-illustration.png" 
              alt="Food" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/orange/white?text=Food"; }}
            />
            <div className="absolute bottom-10 -left-12 bg-white rounded-2xl p-3 shadow-xl flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full"><Star className="w-4 h-4 text-green-600 fill-green-600" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Top Rated</p>
                <p className="text-sm font-bold text-gray-900">Vendors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE CATEGORIES --- */}
      <section className="space-y-3 md:mt-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white">Browse Categories</h2>
          <Link href="/customer/explore" className="text-xs md:text-sm font-bold text-orange-500 md:bg-gray-100 md:py-2 md:px-5 md:rounded-full md:text-gray-800 hover:underline md:hover:no-underline md:hover:bg-gray-200">
            See all
          </Link>
        </div>
        
        {/* Mobile: Horizontal Scroll. Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar py-1">
          {categories.map((cat) => (
            <button key={cat.name} className="group flex flex-col items-center gap-1.5 md:gap-4 min-w-[64px] md:min-w-0 md:w-full p-2.5 md:p-0 rounded-xl bg-gray-50 dark:bg-zinc-800 md:bg-transparent border border-gray-100 dark:border-zinc-700/50 md:border-none transition-all">
              <div className={`text-xl md:text-4xl md:w-full md:aspect-square md:${cat.bg} md:rounded-[2rem] flex items-center justify-center md:shadow-sm md:border border-transparent md:group-hover:border-orange-200 transition-all`}>
                {cat.icon}
              </div>
              <span className="text-[10px] md:text-sm font-medium md:font-bold text-gray-700 dark:text-gray-300 md:group-hover:text-orange-500">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --- RESPONSIVE FEATURED MEALS --- */}
      <section className="space-y-3 md:mt-16">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white">Featured Meals</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {/* We reuse your mobile MealCard component for the grid! */}
          <MealCard id="meal-1" name="Spaghetti With Meatballs" vendor="The Brunch Club" price={4500} />
          <MealCard id="meal-2" name="Loaded Fries with Coke" vendor="Foodies Spot" price={6500} />
          <MealCard id="meal-3" name="Smoky Jollof & Chicken" vendor="Taste & See" price={5000} />
          <MealCard id="meal-4" name="Beef Stir Fry Pasta" vendor="The Brunch Club" price={4200} />
        </div>
      </section>
    </div>
  );
}