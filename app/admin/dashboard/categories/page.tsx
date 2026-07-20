"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Search, Filter, Edit, Eye, EyeOff, Layers, Trash2 } from "lucide-react";
import { categoryService } from "@/services/admin/category.service";
import { MealCategory } from "@/types/category";
import { useDebounce } from "@/hooks/useDebounce";
import { EditCategoryModal } from "@/components/admin/categories/EditCategoryModal";
import { DeleteCategoryModal } from "@/components/admin/categories/DeleteCategoryModal";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchTerm, setSearchString] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortBy, setSortBy] = useState<"NAME" | "ORDER" | "DATE">("ORDER");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [editingCategory, setEditingCategory] = useState<MealCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<MealCategory | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      console.error("Fetch categories failed in UI:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Unable to load categories. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message || "Unable to load categories. Please try again.");
      } else {
        setError("Unable to load categories. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, active: !currentStatus, isActive: !currentStatus } : cat)
      );
      
      // Perform the soft delete logic via the API. 
      // Based on prompt "toggle switch that will soft delete/remove the category silently... The backend will actually do the soft delete logic"
      // If we are passing active status, we toggle it. If soft delete is separate, we'd use deleteCategory. 
      // Using toggleCategoryStatus as it implies activation/deactivation soft deletion.
      await categoryService.toggleCategoryStatus(id, !currentStatus);
      
    } catch (_err) {
      // Revert on error
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, active: currentStatus, isActive: currentStatus } : cat)
      );
      alert("Failed to update category status");
    }
  };

  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(
        c => c.name.toLowerCase().includes(lowerSearch) || 
             (c.description && c.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Filter by status
    if (filterStatus === "ACTIVE") {
      result = result.filter(c => c.active || c.isActive);
    } else if (filterStatus === "INACTIVE") {
      result = result.filter(c => !(c.active || c.isActive));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "NAME") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "ORDER") {
        comparison = (a.displayOrder || 0) - (b.displayOrder || 0);
      } else if (sortBy === "DATE") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = dateA - dateB;
      }
      return sortOrder === "ASC" ? comparison : -comparison;
    });

    return result;
  }, [categories, debouncedSearch, filterStatus, sortBy, sortOrder]);

  // Paginate
  const paginatedCategories = filteredAndSortedCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredAndSortedCategories.length / pageSize);

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-4 h-24" />
      ))}
    </div>
  );

  return (
    <div className="pb-24 md:pb-8 relative min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Meal Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage the master organizational categories for meals.
          </p>
        </div>
        
        {/* Desktop Create Button */}
        <Link 
          href="/admin/dashboard/categories/create"
          className="hidden md:flex items-center gap-2 bg-[#FC6B31] hover:bg-[#e55a20] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Category
        </Link>
      </div>

      <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchString(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC6B31]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "NAME" | "ORDER" | "DATE")}
              className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC6B31]"
            >
              <option value="ORDER">Display Order</option>
              <option value="NAME">Name</option>
              <option value="DATE">Date Created</option>
            </select>

            <button 
              onClick={() => setSortOrder(prev => prev === "ASC" ? "DESC" : "ASC")}
              className="p-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Filter className={`w-5 h-5 text-gray-500 transition-transform ${sortOrder === 'DESC' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchCategories}
            className="bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredAndSortedCategories.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No categories found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {searchTerm ? "Try adjusting your search or filters to find what you're looking for." : "Create your first category to help vendors organize meals."}
          </p>
          {!searchTerm && (
            <Link 
              href="/admin/dashboard/categories/create"
              className="bg-[#FC6B31] hover:bg-[#e55a20] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Create Category
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-black/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium text-center">Meals</th>
                    <th className="px-6 py-4 font-medium text-center">Order</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {paginatedCategories.map((category) => {
                    const isCategoryActive = category.active !== undefined ? category.active : category.isActive;
                    
                    return (
                      <tr key={category.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                              {category.imageUrl ? (
                                <Image src={category.imageUrl} alt={category.name} fill sizes="40px" className="object-cover" unoptimized />
                              ) : category.icon ? (
                                category.icon
                              ) : (
                                '🥘'
                              )}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                          {category.description || "--"}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                          {category.mealCount !== undefined ? `${category.mealCount} Meals` : "--"}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 font-medium">
                          {category.displayOrder}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isCategoryActive
                              ? "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          }`}>
                            {isCategoryActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleToggleStatus(category.id, isCategoryActive!)}
                              className="p-2 text-gray-400 hover:text-[#FC6B31] transition-colors"
                              title={isCategoryActive ? "Deactivate" : "Activate"}
                            >
                              {isCategoryActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => setEditingCategory(category)}
                              className="p-2 text-gray-400 hover:text-[#FC6B31] transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingCategory(category)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {paginatedCategories.map((category) => {
              const isCategoryActive = category.active !== undefined ? category.active : category.isActive;
              
              return (
                <div key={category.id} className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        {category.imageUrl ? (
                          <Image src={category.imageUrl} alt={category.name} fill sizes="48px" className="object-cover" unoptimized />
                        ) : category.icon ? (
                          category.icon
                        ) : (
                          '🥘'
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{category.name}</h3>
                        <span className={`inline-flex mt-1 items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isCategoryActive
                            ? "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                        }`}>
                          {isCategoryActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Soft Delete / Toggle Switch for Mobile */}
                    <button 
                      onClick={() => handleToggleStatus(category.id, isCategoryActive!)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 ${
                        isCategoryActive ? 'bg-[#FC6B31]' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isCategoryActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {category.mealCount !== undefined ? category.mealCount : "0"}
                      </span> Meals
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Order: <span className="font-medium text-gray-700 dark:text-gray-300">{category.displayOrder}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setDeletingCategory(category)}
                        className="text-red-500 font-medium p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => setEditingCategory(category)}
                        className="text-[#FC6B31] font-medium p-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white dark:bg-[#26292C] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, filteredAndSortedCategories.length)}</span> of <span className="font-medium">{filteredAndSortedCategories.length}</span> entries
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 dark:text-white"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile FAB */}
      <Link 
        href="/admin/dashboard/categories/create"
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#FC6B31] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e55a20] active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Modals */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          onSuccess={(updated) => {
            setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
            setEditingCategory(null);
          }}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          isOpen={true}
          onClose={() => setDeletingCategory(null)}
          onSuccess={(deletedId) => {
            setCategories(prev => prev.filter(c => c.id !== deletedId));
            setDeletingCategory(null);
          }}
        />
      )}
    </div>
  );
}
