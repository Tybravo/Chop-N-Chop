"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Bell, X } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import DeliveryDropBanner from "@/components/customer/DeliveryDropBanner";
import MealDetailsModal from "@/components/customer/MealDetailsModal";
import TodaysDealsSection from "@/components/customer/TodaysDealsSection";
import CustomerHeader from "@/components/customer/home/CustomerHeader";
import ActiveOrderTracker from "@/components/customer/home/ActiveOrderTracker";
import HomeSearchPrompt from "@/components/customer/home/HomeSearchPrompt";

type MealModalData = {
  name: string;
  vendor: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
};

const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Burger", icon: "🍔" },
  { name: "Fruits", icon: "🍎" },
  { name: "Pizza", icon: "🍕" },
  { name: "Drinks", icon: "🥤" },
];

const bestSellers: MealModalData[] = [
  {
    name: "Melting Cheese Pizza",
    vendor: "Pizza Italiano",
    originalPrice: 12990,
    discountedPrice: 10990,
    image: "/hero-food-illustration.png",
  },
  {
    name: "Cheese Burger",
    vendor: "Burger Hunt",
    originalPrice: 5500,
    discountedPrice: 4990,
    image: "/hero-food-illustration.png",
  },
  {
    name: "Smoky Jollof & Chicken",
    vendor: "Taste & See",
    originalPrice: 6500,
    discountedPrice: 5000,
    image: "/hero-food-illustration.png",
  },
  {
    name: "Beef Stir Fry Pasta",
    vendor: "The Brunch Club",
    originalPrice: 5000,
    discountedPrice: 4200,
    image: "/hero-food-illustration.png",
  },
];

const activeOrder = {
  status: "OUT_FOR_DELIVERY",
  eta: "1:45 PM",
  zone: "Yaba - Akoka",
  step: 3,
};

export default function CustomerHome() {
  const [notificationCount, setNotificationCount] = useState(2);
  const [selectedMeal, setSelectedMeal] = useState<MealModalData | null>(null);
  const [toastNotif, setToastNotif] = useState<{ title: string; body: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const walletBalance = 24500;

  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setNotificationCount((count) => count + 1);
      setToastNotif({
        title: "Order Dispatched!",
        body: "Your drop is on its way to your doorstep in Yaba.",
      });
      toastTimer = setTimeout(() => setToastNotif(null), 5000);
    }, 4500);

    return () => {
      clearTimeout(timer);
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  const openMeal = (meal: MealModalData) => setSelectedMeal(meal);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pb-32 md:px-8 md:pb-12 space-y-6 md:space-y-8 overflow-x-hidden">
      {toastNotif && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 right-4 z-[70] md:max-w-md md:left-auto md:right-8 bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900/30 p-4 rounded-[20px] shadow-2xl shadow-orange-500/20 animate-in slide-in-from-top-3 duration-300 flex items-start gap-3"
        >
          <div className="w-11 h-11 shrink-0 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-[#FC6B31]">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-[14px] font-extrabold text-gray-900 dark:text-white truncate">{toastNotif.title}</h4>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-snug">{toastNotif.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastNotif(null)}
            aria-label="Dismiss notification"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      <CustomerHeader walletBalance={walletBalance} notificationCount={notificationCount} />

      <div className="md:hidden">
        <DeliveryDropBanner />
      </div>

      <div className="md:hidden">
        <ActiveOrderTracker activeOrder={activeOrder} />
      </div>

      <section className="hidden md:block relative overflow-hidden rounded-[2.5rem] bg-[#FC6B31] px-12 py-12 lg:px-20">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-white/80">Scheduled drops, zero wait</p>
            <h1 className="text-5xl leading-[0.95] font-black tracking-[-0.05em] lg:text-6xl">
              Food that feels
              <br />
              just right...
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/90">
              Discover meals from trusted local kitchens and choose a delivery window that fits your day.
            </p>
            <Link
              href="/customer/explore"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-[#FC6B31] shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Explore meals
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative h-[330px] lg:h-[390px]">
            <div className="absolute inset-8 rounded-full bg-white/15 blur-2xl" />
            <Image
              src="/hero-food-illustration.png"
              alt="Fresh ChopnChop meal"
              fill
              className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.28)]"
            />
          </div>
        </div>
      </section>

      <HomeSearchPrompt />

      <section className="w-full space-y-4 md:mt-12" aria-labelledby="categories-title">
        <div className="flex items-center justify-between px-1 md:px-0">
          <h2 id="categories-title" className="text-[18px] font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h2>
          <Link href="/customer/explore" className="text-[13px] font-bold text-gray-500 hover:text-[#FC6B31] transition-colors">
            See all
          </Link>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 px-1 md:px-0">
          {categories.map((category) => {
            const isActive = activeCategory === category.name;
            return (
              <button
                type="button"
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                aria-pressed={isActive}
                className={`flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13px] font-bold shadow-sm transition-colors ${
                  isActive
                    ? "border-[#FC6B31] bg-[#FC6B31] text-white shadow-orange-500/20"
                    : "border-gray-100 bg-white text-gray-700 hover:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300"
                }`}
              >
                <span className="text-[14px]" aria-hidden="true">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="w-full space-y-4 md:mt-16" aria-labelledby="best-sellers-title">
        <div className="flex items-end justify-between px-1 md:px-0">
          <h2 id="best-sellers-title" className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight md:text-2xl">Best Sellers</h2>
          <Link href="/customer/explore" className="text-[13px] font-medium text-[#FC6B31] hover:text-orange-600 transition-colors">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {bestSellers.map((meal, index) => (
            <div key={meal.name} className="relative min-w-0">
              {index === 1 && (
                <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-red-500/30">
                  Only 4 left
                </span>
              )}
              {index === 2 && (
                <span className="absolute left-2 top-2 z-10 rounded-full bg-[#FC6B31] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/30">
                  Selling fast
                </span>
              )}
              <MealCard
                id={`meal-${index + 1}`}
                name={meal.name}
                vendor={meal.vendor}
                price={meal.discountedPrice}
                imageUrl={meal.image}
                onClick={() => openMeal(meal)}
              />
            </div>
          ))}
        </div>
      </section>

      <TodaysDealsSection onSelectMeal={openMeal} />

      <MealDetailsModal isOpen={Boolean(selectedMeal)} meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </div>
  );
}