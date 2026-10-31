import { Meal, CreateDishPayload, VendorDish, VendorDishPage } from "@/types/vendor";
import { mockMeals } from "@/lib/mock/vendor.mock";
import { vendorApiClient } from "@/services/vendor/auth.service";
import { formatApiError } from "@/lib/format-error";

/** Default page size for the vendor dish list (20 per page per PRD). */
export const VENDOR_DISHES_PAGE_SIZE = 20;

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

  // ==========================================
  // View / Update / Delete — Vendor Catalog
  // Note: the backend paths include the doubled
  // "dishes/dishes/{id}" segment (confirmed in live swagger).
  // ==========================================

  /**
   * GET /api/v1/vendor/catalog/dishes/dishes/{id}
   * Fetch a single dish belonging to the authenticated vendor.
   */
  getDishById: async (id: string): Promise<VendorDish> => {
    try {
      const response = await vendorApiClient.get(`/api/v1/vendor/catalog/dishes/dishes/${id}`);
      const data = response.data?.data || response.data;
      return data as VendorDish;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to load the meal details."));
    }
  },

  /**
   * GET /api/v1/vendor/catalog/dishes/
   * Fetch one page of dishes added by the authenticated vendor. The Bearer
   * token (injected by the vendorApiClient interceptor) ensures only the
   * vendor who owns the dishes can list them.
   */
  getVendorDishesPage: async (page = 0, size = VENDOR_DISHES_PAGE_SIZE): Promise<VendorDishPage> => {
    try {
      const response = await vendorApiClient.get("/api/v1/vendor/catalog/dishes/", {
        params: { page, size },
      });
      const data = response.data?.data || response.data;
      // The backend may wrap in { success, message, data } — data holds the page.
      const pageData: VendorDishPage =
        data && typeof data === "object" && Array.isArray(data.content)
          ? data
          : { content: [], totalPages: 0, totalElements: 0, numberOfElements: 0, size, number: page, first: page === 0, last: true, empty: true };
      return {
        content: Array.isArray(pageData.content) ? pageData.content : [],
        totalPages: pageData.totalPages ?? 0,
        totalElements: pageData.totalElements ?? 0,
        numberOfElements: pageData.numberOfElements ?? pageData.content?.length ?? 0,
        size: pageData.size ?? size,
        number: pageData.number ?? page,
        first: pageData.first ?? page === 0,
        last: pageData.last ?? true,
        empty: pageData.empty ?? pageData.content?.length === 0,
      };
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to load your meals."));
    }
  },

  /**
   * PUT /api/v1/vendor/catalog/dishes/dishes/{id}
   * Update an existing dish (same body shape as create).
   */
  updateDish: async (id: string, payload: Partial<CreateDishPayload>): Promise<VendorDish> => {
    try {
      const response = await vendorApiClient.put(
        `/api/v1/vendor/catalog/dishes/dishes/${id}`,
        payload
      );
      const data = response.data?.data || response.data;
      return data as VendorDish;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to update the meal."));
    }
  },

  /**
   * DELETE /api/v1/vendor/catalog/dishes/dishes/{dishId}
   * Soft-delete a dish (removes it from the active catalog).
   */
  deleteDish: async (dishId: string): Promise<boolean> => {
    try {
      const response = await vendorApiClient.delete(
        `/api/v1/vendor/catalog/dishes/dishes/${dishId}`
      );
      const data = response.data?.data || response.data;
      return data?.success !== false;
    } catch (error) {
      throw new Error(formatApiError(error, "Failed to delete the meal."));
    }
  },
};
