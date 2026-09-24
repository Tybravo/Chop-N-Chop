"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Loader2, Lock, UserPlus } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";
import GatewayModal from "@/components/customer/GatewayModal";

// Store & Components
import { useOrderContext } from "@/store/useOrderContext";
import CustomerHeader from "@/components/customer/home/CustomerHeader";
import ActiveOrderTracker from "@/components/customer/home/ActiveOrderTracker";
import HomeSearchPrompt from "@/components/customer/home/HomeSearchPrompt";
import MealCard from "@/components/customer/MealCard";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealDetailsModal from "@/components/customer/MealDetailsModal";
import TodaysDealsSection from "@/components/customer/TodaysDealsSection";
import CategoryPills from "@/components/customer/CategoryPills";
import { useNotifications } from "@/context/NotificationContext";

// --- Aligned API Types based on Backend Responses ---
type ApiCategory = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
};

type ApiProduct = {
  id: string;
  name: string;
  unit: string;
  quantityPerPerson: number;
  price: number;
  type: string;
  soldOut: boolean;
  vendorName: string;
  remainingQuantity: number;
  pickupWindow: string;
};

type ApiDish = {
  id: string;
  name: string;
  vendorId: string;
  description: string;
  imageUrl: string;
  fixedPrice: number;
  isSoldOut: boolean;
  vendorName: string;
  remainingQuantity: number;
  pickupWindow: string;
  ingredientsText: string;
  preparationTime: string;
  servings: number;
  allergens: string[];
  tags: string[];
};

type ApiCategoryChunk = {
  id: string;
  name: string;
  displayOrder: number;
  products: ApiProduct[];
};

type ApiTodaysMenu = {
  hubId: string;
  date: string;
  categories: ApiCategoryChunk[];
  dishes: ApiDish[];
};

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

export default function CustomerHome() {
  const [mounted, setMounted] = useState(false);
  const { location, deliveryWindow } = useOrderContext();
  const { unreadCount } = useNotifications();
  
  // --- Guest vs Authenticated State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealModalData | null>(null);
  
  // --- Gateway Modal State ---
  const [showGateway, setShowGateway] = useState(false);
  
  // --- Catalog State ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([{ id: "All", name: "All", icon: "🍽️" }]);
  const [dailyMeals, setDailyMeals] = useState<MealModalData[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // Mock wallet balance for UI (You can replace this with a real fetch later)
  const walletBalance = isAuthenticated ? 24500 : 0;

  // --- Dynamic Time-Based Suggestions ---
  const getDynamicSuggestions = () => {
    const hour = new Date().getHours();
    if (hour < 11) return ["Yam & Eggs", "Breakfast Wraps", "Coffee"];
    if (hour < 16) return ["Party Jollof", "Chicken Suya", "Smoothies"];
    return ["Dinner Bowls", "Ofada Stew", "Pastries"];
  };
  const [suggestions] = useState<string[]>(getDynamicSuggestions());

  // --- Fetch Catalog Data ---
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsCatalogLoading(true);
      try {
        // 1. Fetch Categories
        const catRes = await customerApiClient.get("/api/v1/catalog/categories");
        const catData: ApiCategory[] = catRes.data;
        const mappedCategories = catData.map((c) => ({
          id: c.name, 
          name: c.name,
          icon: c.name.includes("Burger") ? "🍔" : c.name.includes("Pizza") ? "🍕" : c.name.includes("Drink") ? "🥤" : "🍲"
        }));
        setCategories([{ id: "All", name: "All", icon: "🍽️" }, ...mappedCategories]);

        // 2. Fetch Today's Menu
        const mockHubId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; 
        const menuRes = await customerApiClient.get(`/api/v1/catalog/today?hubId=${mockHubId}`);
        const menuData: ApiTodaysMenu = menuRes.data;
        
        const flattenedMeals: MealModalData[] = [];
        
        // Parse raw products
        menuData.categories?.forEach((categoryChunk) => {
          categoryChunk.products?.forEach((product) => {
            flattenedMeals.push({
              id: product.id,
              name: product.name,
              vendor: product.vendorName,
              originalPrice: product.price,
              discountedPrice: product.price,
              image: "/hero-food-illustration.png",
              stockRemaining: product.soldOut ? 0 : (product.remainingQuantity || 10),
              isSellingFast: (product.remainingQuantity || 10) <= 5 && !product.soldOut,
              categoryId: categoryChunk.id,
              categoryName: categoryChunk.name
            });
          });
        });

        // Parse cooked dishes
        menuData.dishes?.forEach((dish) => {
          flattenedMeals.push({
            id: dish.id,
            name: dish.name,
            vendor: dish.vendorName,
            originalPrice: dish.fixedPrice,
            discountedPrice: dish.fixedPrice,
            image: dish.imageUrl || "/hero-food-illustration.png",
            stockRemaining: dish.isSoldOut ? 0 : (dish.remainingQuantity || 10),
            isSellingFast: (dish.remainingQuantity || 10) <= 5 && !dish.isSoldOut,
            categoryId: "dishes-cooked",
            categoryName: "Cooked Meals"
          });
        });

        if (menuData.dishes?.length > 0 && !mappedCategories.some(c => c.name === "Cooked Meals")) {
            setCategories(prev => [...prev, { id: "Cooked Meals", name: "Cooked Meals", icon: "🔥" }]);
        }

        setDailyMeals(flattenedMeals);
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setIsCatalogLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is actually logged in based on the session token
    const session = localStorage.getItem("chopnchop_session");
    if (session === "active") {
      setIsAuthenticated(true);

      // 1. Fast load: Check LocalStorage cache first, fallback to JWT
      const cachedAvatar = localStorage.getItem("chopnchop_avatar");
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar);
      } else {
        const token = localStorage.getItem("chopnchop_token");
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
            const jwtPic = payload?.profilePictureUrl || payload?.picture || payload?.imageUrl;
            if (jwtPic) setAvatarUrl(jwtPic);
          } catch (e) {
            // silent fail
          }
        }
      }

      // 2. Fresh load: Quietly fetch the latest profile and check all possible image keys
      customerApiClient.get("/api/v1/user/profile")
        .then(res => {
          const pic = res.data?.profilePictureUrl || res.data?.profileImageUrl || res.data?.pictureUrl || res.data?.imageUrl;
          if (pic) {
            setAvatarUrl(pic);
            localStorage.setItem("chopnchop_avatar", pic); // Keep cache updated
          }
        })
        .catch(err => console.error("Failed background profile sync", err));
    }
    
    // Trigger the gateway modal if the user hasn't set their location and time yet
    if (!location || !deliveryWindow) {
      setShowGateway(true);
    }
  }, [location, deliveryWindow]);

  const openMeal = (meal: MealModalData) => setSelectedMeal(meal);

  const displayedMeals = activeCategory === "All" 
    ? dailyMeals 
    : dailyMeals.filter(meal => meal.categoryName === activeCategory);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950" />;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pb-32 md:px-8 md:pb-12 space-y-6 md:space-y-8 overflow-x-hidden animate-in fade-in duration-300">
      
      {/* Mount the Gateway Modal conditionally */}
      {showGateway && <GatewayModal onClose={() => setShowGateway(false)} />}
      
      {/* Pass the auth state and avatar down to the header */}
      <CustomerHeader 
        walletBalance={walletBalance} 
        notificationCount={unreadCount} 
        isAuthenticated={isAuthenticated}
        avatarUrl={avatarUrl}
      />

      <div className="md:hidden">
        <DeliveryDropBanner />
      </div>

      {isAuthenticated ? (
        <div className="md:hidden">
          {/* Tracker manages its own live data fetching now */}
          <ActiveOrderTracker />
        </div>
      ) : (
        <div className="md:hidden rounded-[24px] border border-orange-100 bg-orange-50/60 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-3 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.10] pointer-events-none bg-cover bg-center transition-opacity"
            style={{ backgroundImage: `url('/map.png')` }}
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#FC6B31_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

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
            <div className="pt-1">
              <Link href="/customer/login" className="w-full py-3 bg-[#FC6B31] text-white text-[13px] font-extrabold rounded-xl shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
                <UserPlus className="w-4 h-4" /> Log In or Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

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

      <HomeSearchPrompt suggestions={suggestions} />

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
          <CategoryPills 
            options={categories.map(c => ({ id: c.id, label: c.name, icon: c.icon }))} 
            activeId={activeCategory} 
            onChange={setActiveCategory} 
            className="px-1 md:px-0" 
          />
        )}
      </section>

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