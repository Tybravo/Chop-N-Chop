"use client";

import { useState } from "react";
import { Clock, Truck, Calendar } from "lucide-react";

interface TodaysDealsSectionProps {
  onSelectMeal: (meal: any) => void;
}

export default function TodaysDealsSection({ onSelectMeal }: TodaysDealsSectionProps) {
  const [activeDealTab, setActiveDealTab] = useState("all");

  const dealTabs = [
    { id: "all", label: "All Drops" },
    { id: "breakfast", label: "Breakfast" },
    { id: "brunch", label: "Brunch" },
    { id: "lunch", label: "Lunch" },
    { id: "snacks", label: "Snacks & Small Chops" },
    { id: "dinner", label: "Dinner" },
    { id: "dessert", label: "Dessert" },
    { id: "pastries", label: "Pastries" },
    { id: "drinks", label: "Drinks & Refreshments" },
  ];

  const todaysDealItems = [
    {
      id: "deal-1",
      name: "Fluffy Yam & Scrambled Eggs",
      vendor: "Lagos Mainland Kitchen",
      price: 3500,
      originalPrice: 4500,
      category: "breakfast",
      orderStatus: "Order Closes Today @ 9:00 AM",
      deliveryWindow: "Today, 9:30 AM - 10:00 AM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-2",
      name: "Avocado Toast & Prawns",
      vendor: "The Brunch Club",
      price: 6200,
      originalPrice: 7500,
      category: "brunch",
      orderStatus: "Order Closes Today @ 11:00 AM",
      deliveryWindow: "Today, 11:30 AM - 12:00 PM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-3",
      name: "Smoky Party Jollof & Turkey",
      vendor: "Taste & See",
      price: 5500,
      originalPrice: 6500,
      category: "lunch",
      orderStatus: "Order Closes Today @ 1:00 PM",
      deliveryWindow: "Today, 1:30 PM - 2:00 PM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-4",
      name: "Crispy Suya Wings & Fries",
      vendor: "Grill House Lagos",
      price: 4000,
      originalPrice: 4800,
      category: "snacks",
      orderStatus: "Order Closes Today @ 3:30 PM",
      deliveryWindow: "Today, 4:00 PM - 4:30 PM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-5",
      name: "Ofada Rice & Designer Stew",
      vendor: "Mama's Pot",
      price: 6000,
      originalPrice: 7000,
      category: "dinner",
      orderStatus: "Pre-order Open (Tomorrow Drop)",
      deliveryWindow: "Tomorrow, 8:00 AM - 8:30 AM",
      isNextDay: true,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-6",
      name: "Zobo Chapman Special",
      vendor: "Drink Station",
      price: 1500,
      originalPrice: 2000,
      category: "drinks",
      orderStatus: "Instant / All Day Drop",
      deliveryWindow: "Today, 12:00 PM - 8:00 PM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    },
    {
      id: "deal-7",
      name: "Smoothie Bowl & Granola",
      vendor: "Fresh & Fit",
      price: 4500,
      originalPrice: 5200,
      category: "dessert",
      orderStatus: "Order Closes Today @ 12:00 PM",
      deliveryWindow: "Today, 12:30 PM - 1:00 PM",
      isNextDay: false,
      image: "/hero-food-illustration.png"
    }
  ];

  const filteredDeals = activeDealTab === "all" 
    ? todaysDealItems 
    : todaysDealItems.filter(item => item.category === activeDealTab);

  return (
    <section className="space-y-4 md:mt-24 w-full">
      <div className="flex justify-between items-end mb-2 px-4 md:px-0">
        <div>
          <h2 className="text-[17px] md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Today&apos;s Deal</h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">Live scheduled drop items from vendors across Lagos</p>
        </div>
      </div>
      
      {/* Scrollable Filter Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 px-4 md:px-0">
        {dealTabs.map((tab) => {
          const isActive = activeDealTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDealTab(tab.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-all ${
                isActive
                  ? "bg-[#FC6B31] text-white shadow-md shadow-orange-500/20"
                  : "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-[#FC6B31]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-2 gap-4 px-4 md:px-0 md:grid-cols-4">
        {filteredDeals.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectMeal({
              name: item.name,
              vendor: item.vendor,
              originalPrice: item.originalPrice,
              discountedPrice: item.price,
              image: item.image,
              availabilityWindow: item.orderStatus,
              deliveryWindow: item.deliveryWindow
            })}
            className="bg-white dark:bg-zinc-900 rounded-[20px] p-3 border border-gray-100 dark:border-zinc-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="w-full h-32 rounded-[14px] bg-gray-50 dark:bg-zinc-800 relative overflow-hidden mb-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" 
                />
                
                {item.isNextDay ? (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> Pre-order for Tomorrow
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 bg-[#FC6B31] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    Today&apos;s Drop
                  </span>
                )}
              </div>
              
              <span className="text-[11px] text-gray-400 font-medium block truncate">{item.vendor}</span>
              <h3 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-snug line-clamp-1">{item.name}</h3>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-50 dark:border-zinc-800/60 space-y-2">
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${
                item.isNextDay 
                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50" 
                  : "bg-orange-50 dark:bg-orange-950/40 text-[#FC6B31] border border-orange-200 dark:border-orange-900/50"
              }`}>
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{item.orderStatus}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-700 dark:text-gray-300 px-0.5">
                <Truck className="w-3 h-3 text-[#FC6B31] shrink-0" />
                <span className="truncate">Delivery: {item.deliveryWindow}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[13px] font-extrabold text-gray-900 dark:text-white">₦{item.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 line-through ml-1.5">₦{item.originalPrice.toLocaleString()}</span>
                </div>
                <button className="w-7 h-7 rounded-full bg-[#FC6B31] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:bg-orange-600 transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}