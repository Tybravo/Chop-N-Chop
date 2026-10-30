"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { vendorService } from "@/services/vendor/vendor.service";
import { mealService } from "@/services/vendor/meal.service";
import { VendorDish } from "@/types/vendor";
import { ImageCropperModal } from "@/components/admin/categories/ImageCropperModal";
import {
  CUSTOMER_ORDERING_WINDOW_OPTIONS,
  getCustomerOrderingWindow,
  getDeliveryWindow,
} from "@/lib/vendor-meal-windows";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Check,
  Timer,
  CircleDollarSign,
  Package,
  Tag,
  Wheat,
  ListChecks,
  Image as ImageIcon,
  Clock,
  ChevronDown,
  Upload,
} from "lucide-react";

// ============================================================
// Options — same set used on the Add Meal page
// ============================================================
const PREPARATION_TIME_OPTIONS = [
  "60 minutes",
  "90 minutes",
  "3 hours",
  "6 hours",
  "9 hours",
  "12 hours",
  "18 hours",
  "24 hours",
];

const QUICK_INGREDIENT_OPTIONS = [
  "Rice",
  "Chicken",
  "Beef",
  "Fish",
  "Prawns",
  "Yam",
  "Beans",
  "Plantain",
  "Vegetables",
  "Pepper",
  "Onion",
  "Eggs",
];

const ALLERGEN_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat/Gluten",
  "Sesame",
];

const MEAL_TAG_OPTIONS = ["Spicy", "Vegan", "Vegetarian", "Halal", "Gluten-Free"];

// ============================================================
// Helpers
// ============================================================
const parseIngredients = (text: string): string[] =>
  (text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const formatMoney = (value: number): string =>
  `₦${(value || 0).toLocaleString()}`;

function ChipRow({ labels, tone = "gray" }: { labels: string[]; tone?: "orange" | "gray" | "red" }) {
  if (labels.length === 0) {
    return <span className="text-sm text-gray-500 dark:text-gray-400">None</span>;
  }
  const toneClass =
    tone === "orange"
      ? "bg-[#FC6B31]/10 text-[#e35014]"
      : tone === "red"
        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span key={label} className={`rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

function ChipToggleGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={isActive}
            className={`min-h-[44px] px-4 py-2 rounded-full border text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              isActive
                ? "bg-[#FC6B31] text-white border-[#FC6B31]"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-[#FC6B31]"
            }`}
          >
            {isActive && <Check className="w-4 h-4" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SelectedChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#FC6B31]/10 text-[#e35014] border border-[#FC6B31]/30 rounded-full px-3 py-1.5 text-sm font-medium">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="p-0.5 hover:text-red-600 focus:outline-none">
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

// ============================================================
// Edit form model
// ============================================================
interface EditFormState {
  name: string;
  description: string;
  price: string;
  servings: string;
  preparationTime: string;
  ingredients: string[];
  ingredientInput: string;
  allergens: string[];
  tags: string[];
  tagInput: string;
  orderingWindow: string;
}

const emptyEditForm = (): EditFormState => ({
  name: "",
  description: "",
  price: "",
  servings: "",
  preparationTime: "",
  ingredients: [],
  ingredientInput: "",
  allergens: [],
  tags: [],
  tagInput: "",
  orderingWindow: "",
});

// ============================================================
// Page
// ============================================================
export default function ViewMealsPage() {
  const router = useRouter();
  const params = useParams();
  const email = params.email as string;
  const { user } = useVendorAuth();

  const [vendorId, setVendorId] = useState("");
  const [dishes, setDishes] = useState<VendorDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDish, setViewDish] = useState<VendorDish | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // Edit modal
  const [editDish, setEditDish] = useState<VendorDish | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Edit image (resize/crop then upload — matches the Add Meal flow)
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [isEditCropperOpen, setIsEditCropperOpen] = useState(false);
  const [pendingEditCropFile, setPendingEditCropFile] = useState<File | null>(null);
  const [editImageError, setEditImageError] = useState("");

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<VendorDish | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Initial load — page 0 (20 meals per page).
  const loadDishes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // The endpoint is vendor-scoped; the Bearer token (injected by the
      // vendorApiClient interceptor) ensures only this vendor can list them.
      const result = await mealService.getVendorDishesPage(0);
      const items = Array.isArray(result.content) ? result.content : [];
      setDishes(items);
      setPage(0);
      setHasMore(!result.last && items.length > 0);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load your meals.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load More — fetches the next page (20 more meals) and appends to the grid.
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError("");
    try {
      const nextPage = page + 1;
      const result = await mealService.getVendorDishesPage(nextPage);
      const items = Array.isArray(result.content) ? result.content : [];
      setDishes((prev) => {
        const existing = new Set(prev.map((d) => d.id));
        const fresh = items.filter((d) => !existing.has(d.id));
        return [...prev, ...fresh];
      });
      setPage(nextPage);
      setHasMore(!result.last && items.length > 0);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load more meals.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Resolve the authenticated vendor id from the JWT (via /me/profile),
  // then fetch the vendor's own catalog.
  useEffect(() => {
    let cancelled = false;
    const resolveAndLoad = async () => {
      if (user?.id) setVendorId(user.id);
      try {
        const profile = await vendorService.getProfile();
        if (cancelled) return;
        const id = profile.id || user?.id || "";
        setVendorId(id);
        await loadDishes();
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        // Even if profile resolution fails, still show whatever meals we can
        // (the token is present, and GET-by-id only needs the dish id).
        await loadDishes();
      }
    };
    resolveAndLoad();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return dishes;
    const q = searchQuery.toLowerCase();
    return dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(q) ||
        (dish.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  }, [dishes, searchQuery]);

  // Free the edit-preview object URL on unmount
  useEffect(() => {
    return () => {
      if (editImagePreview && editImagePreview !== editDish?.imageUrl) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- View ----
  const openViewModal = async (id: string) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewError("");
    setViewDish(null);
    try {
      // The GET endpoint is vendor-scoped — the Bearer token (injected by the
      // vendorApiClient interceptor) ensures only this vendor can read it.
      const dish = await mealService.getDishById(id);
      setViewDish(dish);
    } catch (err) {
      console.error(err);
      setViewError(err instanceof Error ? err.message : "Failed to load meal details.");
    } finally {
      setViewLoading(false);
    }
  };

  // ---- Edit ----
  const openEditModal = (dish: VendorDish) => {
    setEditDish(dish);
    setEditImageFile(null);
    setEditImagePreview(dish.imageUrl || "");
    setEditImageError("");
    setEditForm({
      name: dish.name || "",
      description: dish.description || "",
      price: dish.fixedPrice != null ? String(dish.fixedPrice) : "",
      servings: dish.servings != null ? String(dish.servings) : "",
      preparationTime: dish.preparationTime || "",
      ingredients: parseIngredients(dish.ingredientsText),
      ingredientInput: "",
      allergens: dish.allergens || [],
      // The ordering window is persisted inside the dish tags (string).
      orderingWindow: getCustomerOrderingWindow(dish.tags),
      tags: (dish.tags || []).filter(
        (tag) =>
          !CUSTOMER_ORDERING_WINDOW_OPTIONS.some(
            (window) => tag.trim().toLowerCase() === window.toLowerCase()
          )
      ),
      tagInput: "",
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditDish(null);
    setEditImageFile(null);
    if (editImagePreview && editImagePreview !== editDish?.imageUrl) {
      URL.revokeObjectURL(editImagePreview);
    }
  };

  // --- Edit image handling (resize/crop then upload) ---
  const handleEditPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1536000) {
      setEditImageError("Image must be smaller than 1500KB");
      return;
    }

    setEditImageError("");
    setPendingEditCropFile(file);
    setIsEditCropperOpen(true);

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleEditCropComplete = (croppedFile: File) => {
    setIsEditCropperOpen(false);
    setPendingEditCropFile(null);
    // The backend's multipart limit is 1MB — guard here too so the
    // oversize error appears right after cropping, not on Save.
    if (croppedFile.size > 1048576) {
      setEditImageError("The resized image is still too large. Try a smaller photo.");
      return;
    }
    if (editImagePreview && editImagePreview !== editDish?.imageUrl) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditImageFile(croppedFile);
    setEditImagePreview(URL.createObjectURL(croppedFile));
  };

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "servings") {
      setEditForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
      return;
    }
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditValue = (key: "ingredients" | "allergens" | "tags", value: string) => {
    setEditForm((prev) => {
      const list = prev[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDish) return;

    const price = Number(editForm.price);
    const servings = Number(editForm.servings);
    if (!editForm.name.trim()) {
      setEditError("Meal name is required.");
      return;
    }
    if (!editForm.price || Number.isNaN(price) || price <= 0) {
      setEditError("Enter a valid price (greater than 0).");
      return;
    }
    if (!editForm.servings || Number.isNaN(servings) || servings < 1) {
      setEditError("Enter how many servings are available.");
      return;
    }
    if (editForm.ingredients.length === 0) {
      setEditError("Add at least one ingredient.");
      return;
    }
    if (!editForm.preparationTime) {
      setEditError("Select the preparation time.");
      return;
    }
    if (!editForm.orderingWindow) {
      setEditError("Select the customer ordering window.");
      return;
    }

    setSavingEdit(true);
    setEditError("");
    try {
      // Rebuild the full tag list: the ordering window is persisted as a tag
      // (string) so View can read it back from the dish `tags` array.
      const tags = [
        ...(editForm.orderingWindow ? [editForm.orderingWindow] : []),
        ...editForm.tags,
      ];
      await mealService.updateDish(editDish.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        imageUrl: editDish.imageUrl,
        fixedPrice: price,
        vendorId,
        ingredientsList: editForm.ingredients.join(", "),
        preparationTime: editForm.preparationTime,
        servings,
        allergens: editForm.allergens,
        tags,
      });

      // A newly chosen image is uploaded after the update, then re-fetched
      // so the dish record carries the fresh imageUrl.
      if (editImageFile) {
        await mealService.uploadDishImage(editDish.id, editImageFile);
      }
      closeEditModal();
      setToast("Meal updated successfully.");
      await loadDishes();
    } catch (err) {
      console.error(err);
      setEditError(err instanceof Error ? err.message : "Failed to update the meal.");
    } finally {
      setSavingEdit(false);
    }
  };

  // ---- Delete ----
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mealService.deleteDish(deleteTarget.id);
      mealService.removeCreatedDish(deleteTarget.id);
      setDeleteTarget(null);
      setToast("Meal deleted successfully.");
      await loadDishes();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete the meal.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meals Menu</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Meals you have added to your catalog
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
            />
          </div>

          <button
            onClick={() => router.push(`/vendor/${email}/meals/add`)}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Meal</span>
            <span className="sm:hidden">Add Meal</span>
          </button>
        </div>
      </div>

      {/* Feedback */}
      {toast && (
        <div className="cnc-message-rise p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium flex justify-between items-center">
          <span>{toast}</span>
          <button type="button" onClick={() => setToast("")} className="p-2 hover:text-green-800 dark:hover:text-green-200 focus:outline-none">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="cnc-message-rise p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex justify-between items-center">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </span>
          <button type="button" onClick={() => setError("")} className="p-2 hover:text-red-800 dark:hover:text-red-200 focus:outline-none">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="admin-card p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-[#FC6B31]/10 text-[#FC6B31] rounded-full flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">No meals yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {searchQuery
                ? "No meals match your search."
                : "Add your first meal and it will appear here."}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => router.push(`/vendor/${email}/meals/add`)}
              className="inline-flex min-h-[44px] items-center gap-2 px-6 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Meal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="admin-card overflow-hidden flex flex-col">
              <div className="h-44 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                {dish.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      dish.isSoldOut
                        ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    }`}
                  >
                    {dish.isSoldOut ? "Sold Out" : "Available"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{dish.name}</h3>
                  <span className="font-bold text-[#FC6B31] shrink-0">{formatMoney(dish.fixedPrice)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {dish.description || "No description."}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {dish.preparationTime && (
                    <span className="inline-flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-[#FC6B31]" />
                      {dish.preparationTime}
                    </span>
                  )}
                  {dish.servings != null && (
                    <span className="inline-flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-[#FC6B31]" />
                      {dish.servings} servings
                    </span>
                  )}
                  {dish.remainingQuantity != null && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FC6B31]" />
                      {dish.remainingQuantity} left
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openViewModal(dish.id)}
                      aria-label={`View ${dish.name}`}
                      className="min-h-[44px] min-w-[44px] p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(dish)}
                      aria-label={`Edit ${dish.name}`}
                      className="min-h-[44px] min-w-[44px] p-2 text-gray-500 hover:text-[#FC6B31] dark:text-gray-400 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(dish)}
                      aria-label={`Delete ${dish.name}`}
                      className="min-h-[44px] min-w-[44px] p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => openViewModal(dish.id)}
                    className="text-sm font-medium text-[#FC6B31] hover:text-[#e35014] min-h-[44px] px-2 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more — fetches the next 20 meals */}
      {!loading && !searchQuery && dishes.length > 0 && (
        <div className="flex justify-center pt-2">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex min-h-[44px] items-center gap-2 px-8 py-3 bg-[#FC6B31] text-white rounded-full font-semibold shadow-md hover:bg-[#e35014] hover:shadow-[#FC6B31]/30 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Meals...
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  Load More Meals
                </>
              )}
            </button>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              You have seen all your meals — {dishes.length} total
            </p>
          )}
        </div>
      )}

      {/* ============ VIEW MODAL ============ */}
      {viewOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white dark:bg-[#26292C] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#26292C] z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Meal Details</h2>
              <button
                onClick={() => setViewOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#FC6B31]" />
              </div>
            ) : viewError ? (
              <div className="p-6 space-y-4">
                <p className="text-sm text-red-600 dark:text-red-400 inline-flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {viewError}
                </p>
                <button
                  onClick={() => setViewOpen(false)}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : viewDish ? (
              <div className="p-5 space-y-5">
                {viewDish.imageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={viewDish.imageUrl} alt={viewDish.name} className="w-full h-52 object-cover" />
                  </div>
                ) : (
                  <div className="rounded-xl h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewDish.name}</h3>
                    {viewDish.vendorName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{viewDish.vendorName}</p>
                    )}
                  </div>
                  <span className="text-xl font-bold text-[#FC6B31] shrink-0">{formatMoney(viewDish.fixedPrice)}</span>
                </div>

                {viewDish.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{viewDish.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewDish.preparationTime && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1 inline-flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" /> Prep. Time
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">{viewDish.preparationTime}</p>
                    </div>
                  )}
                  {viewDish.servings != null && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1 inline-flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" /> Servings
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">{viewDish.servings}</p>
                    </div>
                  )}
                  {viewDish.remainingQuantity != null && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1 inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Remaining
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">{viewDish.remainingQuantity}</p>
                    </div>
                  )}
                  {viewDish.pickupWindow && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Pickup Window</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{viewDish.pickupWindow}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Customer Ordering Window</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getCustomerOrderingWindow(viewDish.tags) || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Customer Delivery Window</p>
                    <p className="font-semibold text-[#FC6B31]">
                      {getDeliveryWindow(
                        getCustomerOrderingWindow(viewDish.tags),
                        viewDish.preparationTime
                      ) || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Status</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        viewDish.isSoldOut
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {viewDish.isSoldOut ? "Sold Out" : "Available"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2 inline-flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5" /> Ingredients
                  </p>
                  <ChipRow labels={parseIngredients(viewDish.ingredientsText)} />
                </div>

                {(viewDish.allergens || []).length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2 inline-flex items-center gap-1">
                      <ListChecks className="w-3.5 h-3.5" /> Allergens
                    </p>
                    <ChipRow labels={viewDish.allergens} tone="red" />
                  </div>
                )}

                {(viewDish.tags || []).length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2 inline-flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Tags
                    </p>
                    <ChipRow labels={viewDish.tags} tone="orange" />
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex gap-3">
                  <button
                    onClick={() => openEditModal(viewDish)}
                    className="flex-1 min-h-[44px] px-4 py-2.5 border border-[#FC6B31]/40 text-[#FC6B31] rounded-lg font-medium hover:bg-[#FC6B31]/5 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewOpen(false)}
                    className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ============ EDIT MODAL ============ */}
      {editDish && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white dark:bg-[#26292C] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#26292C] z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Meal</h2>
              <button
                onClick={closeEditModal}
                disabled={savingEdit}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
                  <span className="inline-flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {editError}
                  </span>
                  <button type="button" onClick={() => setEditError("")} className="p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ===== Meal Image (small, replaceable) ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Meal Image
                </label>

                {editImageError && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
                    <span>{editImageError}</span>
                    <button type="button" onClick={() => setEditImageError("")} className="p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {editImagePreview ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-sm shrink-0 bg-gray-200 dark:bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editImagePreview} alt="Meal preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1.5">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        onChange={handleEditPictureChange}
                        accept="image/jpeg, image/png, image/gif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full min-h-[44px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-6 px-4 flex flex-col items-center gap-2 hover:border-[#FC6B31] transition-colors group"
                  >
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleEditPictureChange}
                      accept="image/jpeg, image/png, image/gif"
                      className="hidden"
                    />
                    <span className="w-11 h-11 rounded-full bg-[#FC6B31]/10 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-[#FC6B31]" />
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#FC6B31]">
                      Tap to upload a meal image
                    </span>
                    <span className="text-xs text-gray-500">JPG, GIF or PNG. Max 1500KB. Resize before upload.</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Meal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInput}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={editForm.description}
                  onChange={handleEditInput}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CircleDollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="price"
                      inputMode="numeric"
                      value={editForm.price}
                      onChange={handleEditInput}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Servings <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="servings"
                      inputMode="numeric"
                      value={editForm.servings}
                      onChange={handleEditInput}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Preparation Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="preparationTime"
                    value={editForm.preparationTime}
                    onChange={handleEditInput}
                    className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm appearance-none"
                  >
                    <option value="" disabled>
                      Select preparation time...
                    </option>
                    {PREPARATION_TIME_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Customer Ordering Window <span className="text-red-500">*</span>
                </label>
                <ChipToggleGroup
                  options={[...CUSTOMER_ORDERING_WINDOW_OPTIONS]}
                  selected={editForm.orderingWindow ? [editForm.orderingWindow] : []}
                  onToggle={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      orderingWindow: prev.orderingWindow === value ? "" : value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Ingredients <span className="text-red-500">*</span>
                </label>
                <ChipToggleGroup
                  options={QUICK_INGREDIENT_OPTIONS}
                  selected={editForm.ingredients}
                  onToggle={(value) => toggleEditValue("ingredients", value)}
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editForm.ingredientInput}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, ingredientInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = editForm.ingredientInput.trim();
                        if (value) toggleEditValue("ingredients", value);
                        setEditForm((prev) => ({ ...prev, ingredientInput: "" }));
                      }
                    }}
                    placeholder="Add another ingredient..."
                    className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const value = editForm.ingredientInput.trim();
                      if (value) toggleEditValue("ingredients", value);
                      setEditForm((prev) => ({ ...prev, ingredientInput: "" }));
                    }}
                    className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {editForm.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editForm.ingredients.map((item) => (
                      <SelectedChip key={item} label={item} onRemove={() => toggleEditValue("ingredients", item)} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Allergens</label>
                <ChipToggleGroup
                  options={ALLERGEN_OPTIONS}
                  selected={editForm.allergens}
                  onToggle={(value) => toggleEditValue("allergens", value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
                <ChipToggleGroup
                  options={MEAL_TAG_OPTIONS}
                  selected={editForm.tags}
                  onToggle={(value) => toggleEditValue("tags", value)}
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editForm.tagInput}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, tagInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = editForm.tagInput.trim();
                        if (value) toggleEditValue("tags", value);
                        setEditForm((prev) => ({ ...prev, tagInput: "" }));
                      }
                    }}
                    placeholder="Add a custom tag..."
                    className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const value = editForm.tagInput.trim();
                      if (value) toggleEditValue("tags", value);
                      setEditForm((prev) => ({ ...prev, tagInput: "" }));
                    }}
                    className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {editForm.tags.filter((tag) => !MEAL_TAG_OPTIONS.includes(tag)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editForm.tags
                      .filter((tag) => !MEAL_TAG_OPTIONS.includes(tag))
                      .map((tag) => (
                        <SelectedChip key={tag} label={tag} onRemove={() => toggleEditValue("tags", tag)} />
                      ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="flex-1 min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRM MODAL ============ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-white dark:bg-[#26292C] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Meal?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {"Are you sure you want to delete "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {deleteTarget.name}
                  </span>
                  {"? This removes it from your catalog."}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ EDIT IMAGE CROPPER ============ */}
      {pendingEditCropFile && (
        <ImageCropperModal
          imageFile={pendingEditCropFile}
          isOpen={isEditCropperOpen}
          onClose={() => {
            setIsEditCropperOpen(false);
            setPendingEditCropFile(null);
          }}
          onCropComplete={handleEditCropComplete}
        />
      )}
    </div>
  );
}
