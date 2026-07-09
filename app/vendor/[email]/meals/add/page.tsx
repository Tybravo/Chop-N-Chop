"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mealService } from "@/services/vendor/meal.service";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function AddMealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
    preparationTime: "",
    category: "",
    isAvailable: true,
  });

  const [components, setComponents] = useState([
    { ingredient: "", quantity: "", unit: "" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleComponentChange = (index: number, field: string, value: string) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setComponents(newComponents);
  };

  const addComponent = () => {
    setComponents([...components, { ingredient: "", quantity: "", unit: "" }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mealService.addMeal({
        name: formData.name,
        sku: formData.sku,
        price: Number(formData.price),
        description: formData.description,
        preparationTime: Number(formData.preparationTime),
        category: formData.category,
        isAvailable: formData.isAvailable,
        components: components.map((c, i) => ({
          id: `comp_${i}`,
          ingredient: c.ingredient,
          quantity: Number(c.quantity),
          unit: c.unit
        })),
      });
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Meal</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
              <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₦)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm">
                <option value="">Select Category</option>
                <option value="Main Course">Main Course</option>
                <option value="Sides">Sides</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Time (mins)</label>
              <input type="number" name="preparationTime" required value={formData.preparationTime} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" name="isAvailable" id="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4 text-[#FC6B31] focus:ring-[#FC6B31] border-gray-300 rounded" />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900 dark:text-white">Meal is available for order</label>
            </div>
          </div>
        </div>

        <div className="admin-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Image Upload</h3>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#FC6B31] hover:text-[#e35014] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#FC6B31]">
                  <span>Upload a file</span>
                  <input type="file" className="sr-only" accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="admin-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Components / Ingredients</h3>
            <button type="button" onClick={addComponent} className="text-sm text-[#FC6B31] font-medium flex items-center gap-1 hover:text-[#e35014]">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
          
          <div className="space-y-4">
            {components.map((comp, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-1">
                  <input type="text" placeholder="Ingredient (e.g. Rice)" required value={comp.ingredient} onChange={(e) => handleComponentChange(idx, "ingredient", e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
                </div>
                <div className="w-24">
                  <input type="number" placeholder="Qty" required value={comp.quantity} onChange={(e) => handleComponentChange(idx, "quantity", e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
                </div>
                <div className="w-32">
                  <input type="text" placeholder="Unit (e.g. kg)" required value={comp.unit} onChange={(e) => handleComponentChange(idx, "unit", e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
                </div>
                <button type="button" onClick={() => removeComponent(idx)} disabled={components.length === 1} className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 mt-1">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Meal"}
          </button>
        </div>
      </form>
    </div>
  );
}
