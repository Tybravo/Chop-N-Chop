"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import MealCard from "@/components/customer/MealCard";
import { customerApiClient } from "@/lib/api/customerApiClient";
import axios from "axios";

interface FavoriteMeal {
  id: string;
  name: string;
  vendor: string;
  price: number;
  imageUrl?: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteMeals, setFavoriteMeals] = useState<FavoriteMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Derive quick-reorder suggestions from recent orders (live backend data)
        const token = localStorage.getItem("chopnchop_token");
        if (!token) { setFavoriteMeals([]); return; }
        const res = await customerApiClient.get("/api/v1/orders/mine", { params: { page: 0, size: 20 } });
        const orders = res.data?.content || res.data || [];
        const seen = new Set<string>();
        const meals: FavoriteMeal[] = [];
        (Array.isArray(orders) ? orders : []).forEach((o: Record<string, unknown>) => {
          (Array.isArray(o.items) ? o.items : []).forEach((it: Record<string, unknown>) => {
            const id = String(it.productId || it.dishId || it.id || it.name || "");
            if (!id || seen.has(id)) return;
            seen.add(id);
            meals.push({
              id,
              name: String(it.name || "Meal"),
              vendor: String(it.vendorName || "Vendor"),
              price: Number(it.unitPrice || it.totalPrice || 0),
              imageUrl: typeof it.imageUrl === "string" ? it.imageUrl : undefined,
            });
          });
        });
        setFavoriteMeals(meals.slice(0, 12));
      } catch (err) {
        if (!(axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403))) {
          console.error("Failed to load favorites/reorders", err);
        }
        setFavoriteMeals([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-2">
        <button type="button" onClick={() => router.back()} aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Favorites & Quick Reorder</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-7xl px-4">
        {isLoading ? (
          <div role="status" className="mt-8 flex items-center justify-center rounded-[24px] border border-gray-100 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900">
            <Loader2 className="h-6 w-6 animate-spin text-[#FC6B31]" />
          </div>
        ) : favoriteMeals.length === 0 ? (
          <div role="status" className="mt-8 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/20">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">No favorites or quick reorders yet</h3>
            <p className="mt-1 text-[13px] text-gray-500">Meals from your past orders will appear here for quick reordering once you place an order.</p>
            <button type="button" onClick={() => router.push("/customer/explore")}
              className="mt-4 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]">
              Browse meals
            </button>
          </div>
        ) : (
          <>
            <p className="mt-6 px-1 text-[13px] text-gray-500 dark:text-gray-400">Based on your recent orders.</p>
            <div role="list" aria-label="Quick reorder meals" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {favoriteMeals.map((meal) => (
                <div key={meal.id} role="listitem" className="min-w-0">
                  <MealCard id={meal.id} name={meal.name} vendor={meal.vendor} price={meal.price} imageUrl={meal.imageUrl}
                    onClick={() => router.push(meal.id.includes("-") ? `/customer/meals/${meal.id}` : "/customer/explore")} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
