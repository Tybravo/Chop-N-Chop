import { Meal, CreateDishPayload, VendorDish } from "@/types/vendor";
import { mockMeals } from "@/lib/mock/vendor.mock";
import { vendorApiClient } from "@/services/vendor/auth.service";
import { formatApiError } from "@/lib/format-error";

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
  },

  // ==========================================
  // Real backend integration — Vendor Catalog
  // The vendorApiClient interceptor injects the Bearer token (from
  // localStorage "vendor_access_token"), so only an authenticated vendor
  // can create a dish / upload its image.
  // ==========================================

  /** POST /api/v1/vendor/catalog/dishes — Create a new Dish (MVP). */
  createDish: async (payload: CreateDishPayload): Promise<VendorDish> => {
    try {
      const response = await vendorApiClient.post("/api/v1/vendor/catalog/dishes", payload);
      const data = response.data?.data || response.data;
      return data as VendorDish;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to create the meal."));
    }
  },

  /** POST /api/v1/vendor/catalog/dishes/{dishId}/image — Upload dish image. */
  uploadDishImage: async (dishId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await vendorApiClient.post(
        `/api/v1/vendor/catalog/dishes/${dishId}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const url =
        typeof response.data === "string"
          ? response.data
          : response.data?.url ||
            response.data?.imageUrl ||
            response.data?.data?.url ||
            response.data?.data?.imageUrl ||
            "";
      if (!url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }
      return url;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to upload the meal image."));
    }
  },
};
