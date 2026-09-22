"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Bell, X, Settings2, UserPlus, Lock, Loader2 } from "lucide-react";

// Store & Components
import { useOrderContext } from "@/store/useOrderContext";
import CustomerHeader from "@/components/customer/home/CustomerHeader";
import ActiveOrderTracker from "@/components/customer/home/ActiveOrderTracker";
import HomeSearchPrompt from "@/components/customer/home/HomeSearchPrompt";
import MealCard from "@/components/customer/MealCard";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealDetailsModal from "@/components/customer/MealDetailsModal";
import TodaysDealsSection from "@/components/customer/TodaysDealsSection";
import { useNotifications } from "@/context/NotificationContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://afia-a2le.onrender.com";

type MealModalData = {
  id: string;
  name: string;
  vendor: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  stockRemaining: number;
  isSellingFast: boolean;
  categoryId?: string;
  categoryName?: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

type ApiCategory = {
  id: string;
  name: string;
};

type ApiProduct = {
  id: string;
  name: string;
  vendorName: string;
  price: number;
  soldOut: boolean;
  remainingQuantity: number;
};

type ApiCategoryChunk = {
  id: string;
  name: string;
  products: ApiProduct[];
};

export default function CustomerHome() {
  const [mounted, setMounted] = useState(false);
  const { location } = useOrderContext();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  
  // --- Guest vs Authenticated State Toggle ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealModalData | null>(null);
  const [toastNotif, setToastNotif] = useState<{ title: string; body: string } | null>(null);
  
  // --- Catalog State ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([{ id: "all", name: "All", icon: "🍽️" }]);
  const [dailyMeals, setDailyMeals] = useState<MealModalData[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // Guest users see ₦0 or prompt, authenticated users see real balance
  const walletBalance = isAuthenticated ? 24500 : 0;

  // --- Dynamic Time-Based Suggestions ---
  const getDynamicSuggestions = () => {
    const hour = new Date().getHours();
    if (hour < 11) return ["Yam & Eggs", "Breakfast Wraps", "Coffee"];
    if (hour < 16) return ["Party Jollof", "Chicken Suya", "Smoothies"];
    return ["Dinner Bowls", "Ofada Stew", "Pastries"];
  };
  const [suggestions] = useState<string[]>(getDynamicSuggestions());

  // --- Active Hub Order State ---
  const [activeOrder, setActiveOrder] = useState({
    status: "CONFIRMED",
    eta: "1:45 PM",
    zone: location || "Yaba - Akoka",
    step: 1,
    pickupCode: "X7B9Q2", 
  });

  const cycleOrderState = () => {
    if (activeOrder.status === "CONFIRMED") {
      setActiveOrder({ ...activeOrder, status: "PREPARING", step: 2 });
    } else if (activeOrder.status === "PREPARING") {
      setActiveOrder({ ...activeOrder, status: "CONSOLIDATING", step: 3 });
    } else if (activeOrder.status === "CONSOLIDATING") {
      setActiveOrder({ ...activeOrder, status: "OUT_FOR_DELIVERY", step: 4 });
    } else if (activeOrder.status === "OUT_FOR_DELIVERY") {
      setActiveOrder({ ...activeOrder, status: "DELIVERED", step: 5 });
    } else {
      setActiveOrder({ ...activeOrder, status: "CONFIRMED", step: 1 });
    }
  };

  // --- Fetch Catalog Data ---
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsCatalogLoading(true);
      try {
        // Fetch Categories
        const catRes = await fetch(`${API_BASE_URL}/api/v1/catalog/categories`);
        if (catRes.ok) {
          const catData: ApiCategory[] = await catRes.json();
          const mappedCategories = catData.map((c: ApiCategory) => ({
            id: c.id,
            name: c.name,
            icon: c.name.includes("Burger") ? "🍔" : c.name.includes("Pizza") ? "🍕" : c.name.includes("Drink") ? "🥤" : "🍲"
          }));
          setCategories([{ id: "all", name: "All", icon: "🍽️" }, ...mappedCategories]);
        }

        // Fetch Daily Menu (Using a default Hub ID if location doesn't map directly yet)
        const mockHubId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; 
        const menuRes = await fetch(`${API_BASE_URL}/api/v1/catalog/today?hubId=${mockHubId}`);
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          
          // Flatten products from categories array in response
          const flattenedMeals: MealModalData[] = [];
          
          menuData.categories?.forEach((categoryChunk: ApiCategoryChunk) => {
            categoryChunk.products?.forEach((product: ApiProduct) => {
              flattenedMeals.push({
                id: product.id,
                name: product.name,
                vendor: product.vendorName,
                originalPrice: product.price,
                discountedPrice: product.price, // Apply discount logic here if needed
                image: "/hero-food-illustration.png", // Fallback image if product.imageUrl is absent
                stockRemaining: product.soldOut ? 0 : (product.remainingQuantity || 10),
                isSellingFast: (product.remainingQuantity || 10) <= 5 && !product.soldOut,
                categoryId: categoryChunk.id,
                categoryName: categoryChunk.name
              });
            });
          });
          setDailyMeals(flattenedMeals);
        }
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setIsCatalogLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // --- Hydration & Lifecycle ---
  useEffect(() => {
    setMounted(true);
    
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Simulating a toast notification popping up
        setToastNotif({
          title: "Order Dispatched!",
          body: "Your drop is on its way to your doorstep in Yaba.",
        });
        toastTimer = setTimeout(() => setToastNotif(null), 5000);
      }
    }, 4500);

    return () => {
      clearTimeout(timer);
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [isAuthenticated]);

  const openMeal = (meal: MealModalData) => setSelectedMeal(meal);

  // Filter meals based on selected category
  const displayedMeals = activeCategory === "All" 
    ? dailyMeals 
    : dailyMeals.filter(meal => meal.categoryName === activeCategory);

  if (!mounted) return <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950" />;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pb-32 md:px-8 md:pb-12 space-y-6 md:space-y-8 overflow-x-hidden animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastNotif && (
        <div role="status" aria-live="polite" className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 right-4 z-[70] md:max-w-md md:left-auto md:right-8 bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900/30 p-4 rounded-[20px] shadow-2xl shadow-orange-500/20 animate-in slide-in-from-top-3 duration-300 flex items-start gap-3">
          <div className="w-11 h-11 shrink-0 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-[#FC6B31]">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-[14px] font-extrabold text-gray-900 dark:text-white truncate">{toastNotif.title}</h4>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-snug">{toastNotif.body}</p>
          </div>
          <button onClick={() => setToastNotif(null)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Header connected to Wallet Balance and Live Unread Notifications */}
      <CustomerHeader walletBalance={walletBalance} notificationCount={unreadCount} />

      <div className="md:hidden">
        <DeliveryDropBanner />
      </div>

      {/* Conditional Active Order Tracker / Guest Onboarding Card */}
      {isAuthenticated ? (
        <div className="space-y-2 md:hidden">
          <ActiveOrderTracker activeOrder={activeOrder} />
          <div className="flex justify-center pt-1">
            <button 
              onClick={cycleOrderState}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px] font-bold text-gray-600 dark:text-gray-300 active:scale-95 transition-all"
            >
              <Settings2 className="w-3.5 h-3.5" /> Simulate Hub State: {activeOrder.status}
            </button>
          </div>
        </div>
      ) : (
        <div className="md:hidden rounded-[24px] border border-orange-100 bg-orange-50/60 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-3 relative overflow-hidden">
          
          {/* Faded Matchstick / Map Background Layer */}
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.10] pointer-events-none bg-cover bg-center transition-opacity"
            style={{ backgroundImage: `url('/map.png')` }}
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#FC6B31_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-[#FC6B31]/10 flex items-center justify-center text-[#FC6B31]">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Track Live Drops & Earn Rewards</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Get started to unlock live multi-vendor hub tracking and your Chop Wallet.
              </p>
            </div>
            <div className="pt-1 flex gap-2">
              <Link href="/customer/login" className="flex-1 py-2.5 bg-[#FC6B31] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Get Started
              </Link>
              <button 
                onClick={() => setIsAuthenticated(true)} 
                className="px-3 py-2.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl border border-gray-200 dark:border-zinc-700"
                title="Toggle Auth State for Testing"
              >
                Simulate Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Hero Section */}
      <section className="hidden md:block relative overflow-hidden rounded-[2.5rem] bg-[#FC6B31] px-12 py-12 lg:px-20">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white/80">Scheduled drops, zero wait</p>
            <h1 className="text-5xl leading-[0.95] font-black tracking-[-0.05em] lg:text-6xl">
              Food that feels<br />just right...
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/90">
              Discover meals from trusted local kitchens and choose a delivery window that fits your day.
            </p>
            <Link href="/customer/explore" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-[#FC6B31] shadow-lg transition-transform hover:scale-105 active:scale-95">
              Explore meals <Sparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative h-[330px] lg:h-[390px]">
            <div className="absolute inset-8 rounded-full bg-white/15 blur-2xl" />
            <Image src="/hero-food-illustration.png" alt="Fresh ChopnChop meal" fill className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.28)]" />
          </div>
        </div>
      </section>

      {/* Search Prompt */}
      <HomeSearchPrompt suggestions={suggestions} />

      {/* Categories */}
      <section className="w-full space-y-4 md:mt-12" aria-labelledby="categories-title">
        <div className="flex items-center justify-between px-1 md:px-0">
          <h2 id="categories-title" className="text-[18px] font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h2>
          <Link href="/customer/explore" className="text-[13px] font-bold text-gray-500 hover:text-[#FC6B31] transition-colors">See all</Link>
        </div>
        
        {isCatalogLoading ? (
          <div className="flex gap-3 px-1 overflow-x-hidden animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="min-w-[80px] h-[44px] rounded-full bg-gray-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 px-1 md:px-0">
            {categories.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  aria-pressed={isActive}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13px] font-bold shadow-sm transition-colors whitespace-nowrap ${
                    isActive ? "border-[#FC6B31] bg-[#FC6B31] text-white shadow-orange-500/20" : "border-gray-100 bg-white text-gray-700 hover:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300"
                  }`}
                >
                  <span className="text-[14px]" aria-hidden="true">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Daily Menu (Best Sellers) */}
      <section className="w-full space-y-4 md:mt-16" aria-labelledby="best-sellers-title">
        <div className="flex items-end justify-between px-1 md:px-0">
          <div className="min-w-0">
            <h2 id="best-sellers-title" className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight md:text-2xl">
              Available in {location ? location.split(' - ')[0] : 'your zone'}
            </h2>
          </div>
          <Link href="/customer/explore" className="text-[13px] font-medium text-[#FC6B31] hover:text-orange-600 transition-colors shrink-0 pl-4">See All</Link>
        </div>
        
        {isCatalogLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#FC6B31] animate-spin" />
          </div>
        ) : displayedMeals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-[24px]">
            <p className="text-gray-500 font-medium">No meals available for this category today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {displayedMeals.map((meal) => (
              <div key={meal.id} className="relative min-w-0">
                {meal.stockRemaining <= 5 && meal.stockRemaining > 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-red-500/30">
                    Only {meal.stockRemaining} left
                  </span>
                )}
                
                {meal.isSellingFast && meal.stockRemaining > 5 && (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-[#FC6B31] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/30">
                    Selling fast
                  </span>
                )}

                {meal.stockRemaining === 0 && (
                  <div className="absolute inset-0 z-20 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-[24px]">
                    <span className="bg-gray-900 text-white font-black text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                      SOLD OUT
                    </span>
                  </div>
                )}

                <MealCard 
                  id={meal.id} 
                  name={meal.name} 
                  vendor={meal.vendor} 
                  price={meal.discountedPrice} 
                  imageUrl={meal.image} 
                  onClick={() => {
                    if (meal.stockRemaining > 0) openMeal(meal);
                  }} 
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <TodaysDealsSection onSelectMeal={openMeal} />
      
      <MealDetailsModal 
        isOpen={Boolean(selectedMeal)} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  );
}