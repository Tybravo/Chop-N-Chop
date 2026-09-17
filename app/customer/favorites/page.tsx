"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import MealCard from "@/components/customer/MealCard";

interface FavoriteMeal {
  id: string;
  name: string;
  vendor: string;
  price: number;
}

const favoriteMeals: FavoriteMeal[] = [
  { id: "m2", name: "Smoky Jollof", vendor: "Taste & See", price: 5000 },
  { id: "m1", name: "Cheese Burger", vendor: "Burger Haven", price: 8990 },
];

export default function FavoritesPage() {
  const router = useRouter();

  const openMeal = (mealId: string) => {
    router.push(`/customer/meals/${mealId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Favorites</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-3xl">
        {favoriteMeals.length === 0 ? (
          <div role="status" className="mt-8 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/20">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">No favorites yet</h3>
            <p className="mt-1 text-[13px] text-gray-500">Save meals from the menu to find them here for quick reorders.</p>
            <button
              type="button"
              onClick={() => router.push("/customer/explore")}
              className="mt-4 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
            >
              Browse meals
            </button>
          </div>
        ) : (
          <div role="list" aria-label="Favorite meals" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {favoriteMeals.map((meal) => (
              <div key={meal.id} role="listitem" className="min-w-0">
                <MealCard
                  id={meal.id}
                  name={meal.name}
                  vendor={meal.vendor}
                  price={meal.price}
                  onClick={() => openMeal(meal.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
