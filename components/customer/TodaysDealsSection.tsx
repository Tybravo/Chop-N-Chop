"use client";

import { useState, useEffect } from "react";
import { Clock, Truck, Calendar, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { customerApiClient } from "@/lib/api/customerApiClient";
import CategoryPills from "@/components/customer/CategoryPills"; // <-- Updated Import

interface TodaysDealsSectionProps {
  onSelectMeal: (meal: any) => void;
}

// --- API Types aligned with Swagger Documentation ---
type ApiProduct = {
  id: string;
  name: string;
  price: number;
  vendorName: string;
  pickupWindow: string;
};

type ApiDish = {
  id: string;
  name: string;
  fixedPrice: number;
  vendorName: string;
  pickupWindow: string;
  imageUrl: string;
};

type ApiCategoryChunk = {
  id: string;
  name: string;
  products: ApiProduct[];
};

type ApiTodaysMenu = {
  hubId: string;
  date: string;
  categories: ApiCategoryChunk[];
  dishes: ApiDish[];
};

// --- UI Types ---
type DealItem = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  originalPrice: number;
  category: string;
  categoryId: string;
  orderStatus: string;
  deliveryWindow: string;
  isNextDay: boolean;
  image: string;
};

type DealTab = {
  id: string;
  label: string;
};

export default function TodaysDealsSection({ onSelectMeal }: TodaysDealsSectionProps) {
  const [activeDealTab, setActiveDealTab] = useState("all");
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [todaysDealItems, setTodaysDealItems] = useState<DealItem[]>([]);
  const [dealTabs, setDealTabs] = useState<DealTab[]>([{ id: "all", label: "All Drops" }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const mockHubId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; 
        const res = await customerApiClient.get(`/api/v1/catalog/today?hubId=${mockHubId}`);
        const menuData: ApiTodaysMenu = res.data;

        const items: DealItem[] = [];
        const tabsMap = new Map<string, string>();

        // 1. Process Raw Products / Add-ons mapped to Categories
        if (menuData.categories) {
          menuData.categories.forEach((cat) => {
            tabsMap.set(cat.id, cat.name);
            cat.products?.forEach((prod) => {
              items.push({
                id: prod.id,
                name: prod.name,
                vendor: prod.vendorName || "Verified Vendor",
                price: prod.price,
                originalPrice: Math.round(prod.price * 1.15), // Mocked discount ratio for UI
                category: cat.id,
                categoryId: cat.id,
                orderStatus: "Closes before drop",
                deliveryWindow: prod.pickupWindow || "Standard Drop",
                isNextDay: false,
                image: "/hero-food-illustration.png",
              });
            });
          });
        }

        // 2. Process Cooked Dishes
        if (menuData.dishes && menuData.dishes.length > 0) {
          tabsMap.set("cooked-meals", "Cooked Meals");
          menuData.dishes.forEach((dish) => {
            items.push({
              id: dish.id,
              name: dish.name,
              vendor: dish.vendorName || "Verified Chef",
              price: dish.fixedPrice,
              originalPrice: Math.round(dish.fixedPrice * 1.2), // Mocked discount ratio for UI
              category: "cooked-meals",
              categoryId: "cooked-meals",
              orderStatus: "Closes before drop",
              deliveryWindow: dish.pickupWindow || "Standard Drop",
              isNextDay: false,
              image: dish.imageUrl || "/hero-food-illustration.png",
            });
          });
        }

        setTodaysDealItems(items);
        
        // 3. Build dynamic tabs from mapped categories
        const newTabs = [{ id: "all", label: "All Drops" }];
        tabsMap.forEach((name, id) => {
          newTabs.push({ id, label: name });
        });
        setDealTabs(newTabs);

      } catch (error) {
        console.error("Failed to fetch today's deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const filteredDeals = activeDealTab === "all" 
    ? todaysDealItems 
    : todaysDealItems.filter(item => item.category === activeDealTab);

  const handleQuickAdd = (e: React.MouseEvent, item: DealItem) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      desc: `${item.vendor} • Deal Drop`,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <section className="space-y-4 md:mt-24 w-full">
      <div className="flex justify-between items-end mb-2 px-4 md:px-0">
        <div>
          <h2 className="text-[17px] md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Today&apos;s Deal</h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">Live scheduled drop items from vendors across Lagos</p>
        </div>
      </div>
      
      {/* Scrollable Filter Tabs mapped via the new component */}
      {!isLoading && dealTabs.length > 1 && (
        <CategoryPills // <-- Updated Component Call
          options={dealTabs} 
          activeId={activeDealTab} 
          onChange={setActiveDealTab} 
          className="px-4 md:px-0" 
        />
      )}

      {/* Grid of Items */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#FC6B31] animate-spin" />
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-[20px] border border-gray-100 dark:border-zinc-800 mx-4 md:mx-0">
          <p className="text-gray-500 text-[13px] font-medium">No live deals available right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 md:px-0 md:grid-cols-4">
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
              className="bg-white dark:bg-zinc-900 rounded-[20px] p-3 border border-gray-100 dark:border-zinc-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Image Container */}
              <div className="w-full h-28 rounded-[14px] bg-gray-50 dark:bg-zinc-800 relative overflow-hidden mb-3 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform duration-300" 
                />
                
                {item.isNextDay ? (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> Tomorrow
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 bg-[#FC6B31] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    Today
                  </span>
                )}
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col flex-1">
                <span className="text-[11px] text-gray-400 font-medium block truncate">{item.vendor}</span>
                <h3 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[36px] mt-0.5">
                  {item.name}
                </h3>

                <div className="mt-auto pt-3 space-y-2">
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1.5 rounded-lg ${
                    item.isNextDay 
                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50" 
                      : "bg-orange-50 dark:bg-orange-950/40 text-[#FC6B31] border border-orange-100 dark:border-orange-900/50"
                  }`}>
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="leading-tight">{item.orderStatus}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300 px-1">
                    <Truck className="w-3 h-3 text-[#FC6B31] shrink-0" />
                    <span className="truncate">{item.deliveryWindow}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-zinc-800/60 mt-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[14px] font-extrabold text-gray-900 dark:text-white">₦{item.price.toLocaleString()}</span>
                      <span className="text-[11px] text-gray-400 line-through">₦{item.originalPrice.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={(e) => handleQuickAdd(e, item)}
                      className="w-7 h-7 shrink-0 rounded-full bg-[#FC6B31] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:bg-orange-600 transition-colors active:scale-95"
                      title="Quick Add to Cart"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}