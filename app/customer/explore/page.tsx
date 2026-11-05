"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, ChefHat, X } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import MealDetailsModal from "@/components/customer/MealDetailsModal";
import { SafeAvatar } from "@/components/SafeAvatar";
import { customerApiClient } from "@/lib/api/customerApiClient";
import { useOrderContext } from "@/store/useOrderContext";

interface Category {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
}

interface Meal {
  id: string;
  name: string;
  vendor: string;
  price: number;
  category: string;
  image?: string;
}

const handleBackNavigation = (router: ReturnType<typeof useRouter>) => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/customer/home');
  }
};

export default function ExplorePage() {
  const router = useRouter();
  const { resolvedZone } = useOrderContext();
  
  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([{ id: "all", name: "All", icon: "🍽️" }]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<{
    name: string;
    vendor: string;
    originalPrice: number;
    discountedPrice: number;
    image: string;
  } | null>(null);
  
  // Modal & Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Recommended");
  const [minPrice, setMinPrice] = useState("1000");
  const [maxPrice, setMaxPrice] = useState("15000");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await customerApiClient.get("/api/v1/catalog/categories", {
          headers: { "X-App-Brand": "CHOP_N_CHOP" },
        });
        const payload = res.data;
        const data = Array.isArray(payload) ? payload : payload?.data || payload?.content || [];
        if (Array.isArray(data) && data.length > 0) {
          setCategories([
            { id: "all", name: "All", icon: "🍽️" },
            ...data.map((cat: any) => ({
              id: cat.id || cat.name,
              name: cat.name,
              icon: cat.icon || "🍽️",
              imageUrl: cat.imageUrl,
            })),
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      try {
        const hubId = resolvedZone?.zoneId || "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        const res = await customerApiClient.get(`/api/v1/catalog/today?hubId=${hubId}`, {
          headers: { "X-App-Brand": "CHOP_N_CHOP" },
        });
        const menuData = res.data;
        const flattenedMeals: Meal[] = [];
        const vendorMap = new Map<string, { id: string; name: string }>();
        
        menuData?.categories?.forEach((categoryChunk: any) => {
          categoryChunk?.products?.forEach((product: any) => {
            const vendorName = product.vendorName || "Vendor";
            const vendorId = product.vendorId || vendorName;
            if (!vendorMap.has(vendorId)) vendorMap.set(vendorId, { id: vendorId, name: vendorName });
            flattenedMeals.push({
              id: product.id,
              name: product.name,
              vendor: vendorName,
              price: product.price,
              category: categoryChunk.categoryName || "Meal",
              image: product.imageUrl || "/hero-food-illustration.png",
            });
          });
          categoryChunk?.preparedDishes?.forEach((dish: any) => {
            if (!dish.baseProductId) {
              const vendorName = dish.vendorName || "Vendor";
              const vendorId = dish.vendorId || vendorName;
              if (!vendorMap.has(vendorId)) vendorMap.set(vendorId, { id: vendorId, name: vendorName });
              flattenedMeals.push({
                id: dish.id,
                name: dish.name,
                vendor: vendorName,
                price: dish.price,
                category: categoryChunk.categoryName || "Meal",
                image: dish.imageUrl || "/hero-food-illustration.png",
              });
            }
          });
        });
        
        setMeals(flattenedMeals);
        setVendors(Array.from(vendorMap.values()));
      } catch (err) {
        console.error("Failed to fetch meals", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeals();
  }, [resolvedZone?.zoneId]);

  // --- Multi-field Filter Logic ---
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory = activeCategory === "All" || meal.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      meal.name.toLowerCase().includes(searchLower) ||
      meal.vendor.toLowerCase().includes(searchLower) ||
      meal.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  // Handle Reset 
  const handleResetFilters = () => {
    setActiveSort("Recommended");
    setMinPrice("1000");
    setMaxPrice("15000");
    setIsFilterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-32">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-4 flex flex-col gap-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <button onClick={() => handleBackNavigation(router)} className="p-2 -ml-2 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">Explore</h1>
          <div className="w-9" />
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="flex gap-3 w-full max-w-7xl mx-auto">
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
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="w-[52px] shrink-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[16px] flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:border-[#FC6B31] hover:text-[#FC6B31] transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        
        {/* --- CATEGORIES (Bleed Carousel) --- */}
        <section>
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 snap-x">
            <div className="w-1 shrink-0 snap-start" /> 
            
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border shrink-0 snap-start ${
                  activeCategory === cat.name 
                    ? "bg-[#FC6B31] border-[#FC6B31] text-white shadow-md shadow-orange-500/20" 
                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-[#FC6B31]"
                }`}
              >
                {cat.imageUrl ? (
                  <SafeAvatar src={cat.imageUrl} alt={cat.name} width={16} height={16} className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <span className="text-[14px]">{cat.icon}</span>
                )}
                <span className="font-bold text-[13px]">{cat.name}</span>
              </button>
            ))}
            
            <div className="w-1 shrink-0" />
          </div>
        </section>

        {/* --- FEATURED STORES (Derived from catalog) --- */}
        {!isLoading && vendors.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white tracking-tight">Stores</h2>
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-3 items-start snap-x snap-mandatory">
              <div className="w-0.5 shrink-0 snap-start" />
              {vendors.map((vendor) => (
                <Link 
                  href={`/customer/vendor/${vendor.id}`} 
                  key={vendor.id} 
                  className="flex flex-col w-[220px] min-w-[220px] shrink-0 bg-white dark:bg-zinc-900 rounded-[20px] p-4 border border-gray-100 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-black/20 text-left group hover:border-gray-200 transition-all cursor-pointer snap-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FC6B31]/10 flex items-center justify-center text-[#FC6B31]">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[14px] text-gray-900 dark:text-white truncate">{vendor.name}</h3>
                      <p className="text-[11px] text-gray-500">Available in today&apos;s drop</p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="w-0.5 shrink-0" /> 
            </div>
          </section>
        )}

        {/* --- AVAILABLE PRODUCTS GRID --- */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white tracking-tight">
              {activeCategory === "All" ? "Popular Meals" : `${activeCategory} Meals`}
            </h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#FC6B31] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredMeals.length === 0 ? (
            <div className="w-full py-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-zinc-900/50 rounded-[20px] border border-dashed border-gray-200 dark:border-zinc-800">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">No meals found</p>
              <p className="text-[12px] text-gray-500">Try searching for a different brand or meal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {filteredMeals.map((meal) => (
                <MealCard 
                  key={meal.id}
                  id={meal.id} 
                  name={meal.name} 
                  vendor={meal.vendor} 
                  price={meal.price} 
                  image={meal.image}
                  onClick={() => setSelectedMeal({
                    name: meal.name, 
                    vendor: meal.vendor, 
                    originalPrice: meal.price + 1500,
                    discountedPrice: meal.price, 
                    image: meal.image || "/hero-food-illustration.png"
                  })}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />

      {/* --- ADVANCED FILTER BOTTOM SHEET --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-t-[32px] p-6 pb-10 shadow-2xl transform transition-transform animate-in slide-in-from-bottom-full duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-white tracking-tight">Filters</h2>
              <button 
                onClick={() => setIsFilterModalOpen(false)} 
                className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-7 max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
              
              {/* Sort Section */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Sort By</h3>
                <div className="flex flex-wrap gap-2.5">
                  {["Recommended", "Top Rated", "Fastest Delivery", "Price: Low to High"].map((sort) => {
                    const isActive = activeSort === sort;
                    return (
                      <button 
                        key={sort} 
                        onClick={() => setActiveSort(sort)}
                        className={`flex items-center justify-center px-4 py-2.5 rounded-full text-[13px] font-bold border transition-colors ${
                          isActive 
                            ? "bg-[#FC6B31] text-white border-[#FC6B31] shadow-sm" 
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-800"
                        }`}
                      >
                        {sort}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range Section with Inputs */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Price Range</h3>
                <div className="flex gap-4">
                  
                  {/* Min Price Input */}
                  <div className="flex flex-col justify-center flex-1 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 focus-within:border-[#FC6B31] dark:focus-within:border-[#FC6B31] transition-colors group">
                    <label htmlFor="minPrice" className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block mb-0.5 cursor-text">Min</label>
                    <div className="flex items-center text-[15px] font-bold text-gray-900 dark:text-white">
                      <span className="mr-1 text-gray-400 group-focus-within:text-[#FC6B31]">₦</span>
                      <input 
                        id="minPrice"
                        type="text" 
                        inputMode="numeric"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} // only allow numbers
                        className="bg-transparent border-none outline-none w-full p-0 font-bold text-gray-900 dark:text-white placeholder-gray-400"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Max Price Input */}
                  <div className="flex flex-col justify-center flex-1 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 focus-within:border-[#FC6B31] dark:focus-within:border-[#FC6B31] transition-colors group">
                    <label htmlFor="maxPrice" className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block mb-0.5 cursor-text">Max</label>
                    <div className="flex items-center text-[15px] font-bold text-gray-900 dark:text-white">
                      <span className="mr-1 text-gray-400 group-focus-within:text-[#FC6B31]">₦</span>
                      <input 
                        id="maxPrice"
                        type="text" 
                        inputMode="numeric"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} // only allow numbers
                        className="bg-transparent border-none outline-none w-full p-0 font-bold text-gray-900 dark:text-white placeholder-gray-400"
                        placeholder="Any"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
              <button 
                onClick={handleResetFilters} 
                className="flex flex-1 items-center justify-center py-4 rounded-[18px] text-[15px] font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterModalOpen(false)} 
                className="flex flex-[2] items-center justify-center py-4 rounded-[18px] text-[15px] font-bold text-white bg-[#FC6B31] shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
