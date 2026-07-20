import { adminApiClient } from '@/lib/axios';
import { MealCategory, CreateCategoryPayload } from '@/types/category';
import axios from 'axios';

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<MealCategory[]> {
    try {
      const response = await adminApiClient.get('/api/v1/admin/catalog/categories');
      // Adjusting if backend wraps it in data or returns array directly
      return response.data?.data || response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error fetching categories:', error);
      }
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<MealCategory> {
    try {
      const response = await adminApiClient.get(`/api/v1/admin/catalog/categories/${id}`);
      return response.data?.data || response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching category ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error fetching category ${id}:`, error);
      }
      throw error;
    }
  },

  /**
   * Create a new category
   */
  async createCategory(payload: CreateCategoryPayload): Promise<MealCategory> {
    try {
      const response = await adminApiClient.post('/api/v1/admin/catalog/categories', payload);
      return response.data?.data || response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating category:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error creating category:', error);
      }
      throw error;
    }
  },

  /**
   * Update a category
   */
  async updateCategory(id: string, payload: Partial<CreateCategoryPayload>): Promise<MealCategory> {
    try {
      const response = await adminApiClient.put(`/api/v1/admin/catalog/categories/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating category ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error updating category ${id}:`, error);
      }
      throw error;
    }
  },

  /**
   * Toggle category status (soft delete or deactivate)
   */
  async toggleCategoryStatus(id: string, active: boolean): Promise<MealCategory> {
    try {
      const response = await adminApiClient.patch(`/api/v1/admin/catalog/categories/${id}/status?active=${active}`);
      return response.data?.data || response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error toggling status for category ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error toggling status for category ${id}:`, error);
      }
      throw error;
    }
  },
  
  /**
   * Upload category image
   * Synchronously uploads an image to Cloudinary and attaches it to the category.
   */
  async uploadCategoryImage(categoryId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await adminApiClient.post(`/api/v1/admin/catalog/categories/${categoryId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data?.data || response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error uploading image for category ${categoryId}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error uploading image for category ${categoryId}:`, error);
      }
      throw error;
    }
  },
  
  /**
   * Soft delete category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await adminApiClient.delete(`/api/v1/admin/catalog/categories/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error deleting category ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error deleting category ${id}:`, error);
      }
      throw error;
    }
  }
};
