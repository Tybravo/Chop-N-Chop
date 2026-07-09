"use client";

import { useState, useEffect } from "react";
import { mealService } from "@/services/vendor/meal.service";
import { Meal } from "@/types/vendor";
import { Search, Plus, Edit, Eye, Trash2, Power } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ViewMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const params = useParams();
  const email = params.email as string;

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const data = await mealService.getMeals();
      setMeals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await mealService.updateMeal(id, { isAvailable: !currentStatus });
      setMeals(meals.map(m => m.id === id ? updated : m));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meals Menu</h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meals..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
            />
          </div>
          
          <Link 
            href={`/vendor/${email}/meals/add`}
            className="px-4 py-2 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Meal</span>
          </Link>
        </div>
      </div>

      {/* Desktop Toggle */}
      <div className="hidden lg:flex justify-end gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button onClick={() => setViewMode("grid")} className={`px-3 py-1 text-sm font-medium rounded-md ${viewMode === "grid" ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Grid View</button>
        <button onClick={() => setViewMode("table")} className={`px-3 py-1 text-sm font-medium rounded-md ${viewMode === "table" ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Table View</button>
      </div>

      {/* Grid / Mobile Cards View */}
      {(viewMode === "grid" || typeof window !== "undefined" && window.innerWidth < 1024) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <div key={meal.id} className="admin-card overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                {meal.imageUrl ? (
                  <Image src={meal.imageUrl} alt={meal.name} fill className="object-cover" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {meal.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{meal.name}</h3>
                  <span className="font-bold text-[#FC6B31]">₦{meal.price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{meal.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-500 hover:text-[#FC6B31] transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={() => handleToggleAvailability(meal.id, meal.isAvailable)}
                    className={`p-1.5 rounded-full transition-colors ${meal.isAvailable ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View (Desktop Only) */}
      {viewMode === "table" && (
        <div className="hidden lg:block admin-card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{meal.name}</div>
                        <div className="text-xs text-gray-500">{meal.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FC6B31]">₦{meal.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleAvailability(meal.id, meal.isAvailable)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {meal.isAvailable ? 'Available' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-400 hover:text-blue-500"><Eye className="w-5 h-5" /></button>
                      <button className="text-gray-400 hover:text-[#FC6B31]"><Edit className="w-5 h-5" /></button>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
