"use client";

import { ArrowLeft, Clock, Users, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FoodDetailsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 pb-20">
      {/* Orange Curved Header */}
      <div className="bg-orange-500 pt-6 pb-14 px-4 rounded-b-[2.5rem] relative flex flex-col items-center">
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mt-6 bg-white">
          <img 
            src="/hero-food-illustration.png" 
            alt="Spaghetti with Meatballs" 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/200x200/orange/white?text=Food"; }}
          />
        </div>
        <h1 className="text-xl font-bold text-white mt-4 text-center px-4">Spaghetti with Meatballs</h1>
        <p className="text-xs text-orange-100 flex items-center gap-1 mt-1 font-medium">
          The Brunch Club <span className="text-[10px]">●</span> Verified Vendor
        </p>
      </div>

      {/* Meal Info Body */}
      <div className="p-6 space-y-6 flex-1 -mt-4 relative z-10 bg-white dark:bg-zinc-900 rounded-t-[2.5rem]">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Savor the tasty mix in our Stir Fry Spaghetti! This quick meal features al dente spaghetti, fresh veggies, tender chicken, and a savory sauce.
          </p>
        </div>

        {/* Pricing Row */}
        <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Original Price</span>
            <span className="text-sm line-through text-gray-400 font-bold mt-0.5">₦4,500</span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700"></div>
          <div>
            <span className="text-[11px] text-orange-500 block uppercase tracking-wider font-bold">Today's Drop</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">₦3,000</span>
          </div>
        </div>

        {/* What's Included */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">What's Included?</h3>
          <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
            {["4 scoops of Jollof Rice", "Whole Chicken", "Special Soy Sauce Dipping"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-500/20 p-1 rounded-full">
                  <Check className="w-3 h-3 text-orange-500" />
                </div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm">
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Prep Time</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5 block">30mins - 1hr</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 shadow-sm">
            <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-full">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <span className="text-[10px] text-orange-500 block uppercase font-bold tracking-wider">Servings Left</span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5 block">100 available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md z-40 max-w-md mx-auto">
        <button
          onClick={() => router.push("/cart")}
          className="w-full py-4 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2"
        >
          <span>Pay ₦3,000</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}