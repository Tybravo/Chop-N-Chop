import { Meal } from "@/types/vendor";
import { mockMeals } from "@/lib/mock/vendor.mock";

export const mealService = {
  getMeals: async (): Promise<Meal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMeals), 500);
    });
  },

  addMeal: async (meal: Omit<Meal, "id" | "vendorId">): Promise<Meal> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMeal: Meal = {
          ...meal,
          id: `meal_${Date.now()}`,
          vendorId: "vendor_1",
        };
        resolve(newMeal);
      }, 500);
    });
  },

  updateMeal: async (id: string, updates: Partial<Meal>): Promise<Meal> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const meal = mockMeals.find(m => m.id === id);
        if (meal) {
          resolve({ ...meal, ...updates });
        } else {
          reject(new Error("Meal not found"));
        }
      }, 500);
    });
  },

  deleteMeal: async (_id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }
};
