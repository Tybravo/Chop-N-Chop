"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, ChefHat } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import MealDetailsModal from "@/components/customer/MealDetailsModal";

export default function ExplorePage() {
  const router = useRouter();
  
  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  // --- Mock Data ---
  const categories = [
    { name: "All", icon: "🍽️" },
    { name: "Rice", icon: "🍛" },
    { name: "Burger", icon: "🍔" },
    { name: "Pizza", icon: "🍕" },
    { name: "Healthy", icon: "🥗" },
    { name: "Drinks", icon: "🥤" },
  ];

  const vendors = [
    { id: 1, name: "The Brunch Club", rating: 4.8, time: "30-45 min", image: "/hero-food-illustration.png" },
    { id: 2, name: "Pizza Italiano", rating: 4.9, time: "20-30 min", image: "/hero-food-illustration.png" },
    { id: 3, name: "Taste & See", rating: 4.6, time: "45-60 min", image: "/hero-food-illustration.png" },
  ];

  const meals = [
    { id: "m1", name: "Cheese Burger", vendor: "Burger Haven", price: 8990, category: "Burger" },
    { id: "m2", name: "Smoky Jollof", vendor: "Taste & See", price: 5000, category: "Rice" },
    { id: "m3", name: "Chicken Salad", vendor: "Healthy Bites", price: 7990, category: "Healthy" },
    { id: "m4", name: "Melting Pizza", vendor: "Pizza Italiano", price: 11880, category: "Pizza" },
  ];

  // Filter meals based on category
  const filteredMeals = activeCategory === "All" 
    ? meals 
    : meals.filter(meal => meal.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-4 flex flex-col gap-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Explore</h1>
          <div className="w-9" />
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3.5 bg-gray-100 dark:bg-zinc-900 rounded-[16px] text-gray-500 border border-transparent focus-within:border-gray-200 dark:focus-within:border-zinc-700 transition-colors">
            <Search className="w-4 h-4 shrink-0 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search food or vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[14px] text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <button className="w-[52px] shrink-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[16px] flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:border-[#FC6B31] hover:text-[#FC6B31] transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="pt-6 space-y-8">
        
        {/* --- CATEGORIES (Pill Style) --- */}
        <section>
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-2">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border ${
                  activeCategory === cat.name 
                    ? "bg-[#FC6B31] border-[#FC6B31] text-white shadow-md shadow-orange-500/20" 
                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-[#FC6B31]"
                }`}
              >
                <span className="text-[14px]">{cat.icon}</span>
                <span className="font-bold text-[13px]">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* --- FEATURED VENDORS --- */}
        <section className="space-y-3">
          <div className="px-4 flex justify-between items-center">
            <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white tracking-tight">Featured Stores</h2>
          </div>
          
          {/* Added pr-4 to ensure right-side padding protection matches the left side px-4 */}
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-3 pr-4 items-start snap-x snap-mandatory">
            {vendors.map((vendor) => (
              <Link 
                href={`/customer/vendor/${vendor.id}`} 
                key={vendor.id} 
                className="flex flex-col w-[260px] min-w-[260px] shrink-0 bg-white dark:bg-zinc-900 rounded-[20px] p-3 border border-gray-100 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-black/20 text-left group hover:border-gray-200 transition-all cursor-pointer snap-start"
              >
                <div className="w-full h-[130px] shrink-0 rounded-[14px] bg-gray-100 dark:bg-zinc-800 mb-3 overflow-hidden relative">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200/orange/white?text=Store"; }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-bold text-gray-900">{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[15px] text-gray-900 dark:text-white mb-1 truncate">{vendor.name}</h3>
                  <div className="flex items-center gap-3 text-[12px] text-gray-500 font-medium mt-auto">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" /> Ikeja</span>
                    <span className="flex items-center gap-1"><ChefHat className="w-3 h-3 shrink-0" /> {vendor.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- AVAILABLE PRODUCTS GRID --- */}
        <section className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white tracking-tight">
              {activeCategory === "All" ? "Popular Meals" : `${activeCategory} Meals`}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredMeals.map((meal) => (
              <MealCard 
                key={meal.id}
                id={meal.id} 
                name={meal.name} 
                vendor={meal.vendor} 
                price={meal.price} 
                onClick={() => setSelectedMeal({
                  name: meal.name, 
                  vendor: meal.vendor, 
                  originalPrice: meal.price + 1500,
                  discountedPrice: meal.price, 
                  image: "/hero-food-illustration.png"
                })}
              />
            ))}
          </div>
          
          {filteredMeals.length === 0 && (
            <div className="w-full py-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-zinc-900/50 rounded-[20px] border border-dashed border-gray-200 dark:border-zinc-800">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">No meals found</p>
              <p className="text-[12px] text-gray-500">Try selecting a different category.</p>
            </div>
          )}
        </section>

      </div>

      {/* Pop-up Details Modal */}
      <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  );
}