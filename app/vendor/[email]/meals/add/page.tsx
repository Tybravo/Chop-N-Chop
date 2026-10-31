"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { vendorService } from "@/services/vendor/vendor.service";
import { mealService } from "@/services/vendor/meal.service";
import { ImageCropperModal } from "@/components/admin/categories/ImageCropperModal";
import { CUSTOMER_ORDERING_WINDOW_OPTIONS } from "@/lib/vendor-meal-windows";
import {
  Plus,
  X,
  Loader2,
  Upload,
  Camera,
  Image as ImageIcon,
  Timer,
  CircleDollarSign,
  Package,
  Wheat,
  ListChecks,
  Tag,
  Check,
  AlertCircle,
  ChevronDown,
  FileText,
  Clock,
} from "lucide-react";

// ============================================================
// Options shared with the vendor onboarding / catalog flow
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

const CATEGORY_OPTIONS = [
  "Rice Meals",
  "Swallow & Soups",
  "Noodles & Pasta",
  "Grills",
  "Small Chops & Snacks",
  "Pastries & Bakery",
  "Beverages",
  "Desserts",
];

// The Ordering Window options now live in lib/vendor-meal-windows.ts
// (CUSTOMER_ORDERING_WINDOW_OPTIONS — single-select Breakfast/Lunch/Dinner).

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
// Small chip-selector controls
// ============================================================
type ChipToggleGroupProps = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  color?: "orange" | "gray";
};

function ChipToggleGroup({ options, selected, onToggle, color = "orange" }: ChipToggleGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        const activeClass =
          color === "orange"
            ? "bg-[#FC6B31] text-white border-[#FC6B31]"
            : "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white";
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={isActive}
            className={`min-h-[44px] px-4 py-2 rounded-full border text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              isActive
                ? activeClass
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

function CustomChipAdder({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  };
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-0 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
      />
      <button
        type="button"
        onClick={onAdd}
        className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-1 shrink-0"
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
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
// Page
// ============================================================
export default function AddMealPage() {
  const router = useRouter();
  const params = useParams();
  const email = params.email as string;
  const { user } = useVendorAuth();

  const [vendorId, setVendorId] = useState("");
  const [resolvingVendor, setResolvingVendor] = useState(true);

  // Image upload state (mirrors the Update Profile storefront flow)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

  // Feedback
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  // Preview / submit modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<"" | "creating" | "uploading">("");
  const [submittedDishName, setSubmittedDishName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    categoryCustom: "",
    preparationTime: "",
    servings: "",
    ingredients: [] as string[],
    ingredientInput: "",
    allergens: [] as string[],
    orderingWindow: "",
    mealTags: [] as string[],
    customTagInput: "",
  });

  // Resolve the authenticated vendor's profile id (from the JWT via /me/profile).
  // The backend derives identity from the Bearer token — no id is trusted from the client.
  useEffect(() => {
    let cancelled = false;
    const resolveVendor = async () => {
      if (user?.id && !cancelled) setVendorId(user.id);
      try {
        const profile = await vendorService.getProfile();
        if (!cancelled && profile.id) setVendorId(profile.id);
      } catch {
        if (!cancelled) {
          setError("Unable to verify your vendor account. Please try again.");
        }
      } finally {
        if (!cancelled) setResolvingVendor(false);
      }
    };
    resolveVendor();
    return () => {
      cancelled = true;
    };
    // The effect intentionally re-runs only when the resolved vendor id
    // changes — resolving the profile also fetches /me/profile on mount.
  }, [user?.id]);

  // Free the object URL when the cropped image changes / unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Scroll the success message into view (the message renders at the top)
  useEffect(() => {
    if (successMsg && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [successMsg]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Price: digits only
    if (name === "price" || name === "servings") {
      const sanitized = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleIngredient = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(value)
        ? prev.ingredients.filter((v) => v !== value)
        : [...prev.ingredients, value],
    }));
  };

  const addCustomIngredient = () => {
    const trimmed = formData.ingredientInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(trimmed)
        ? prev.ingredients
        : [...prev.ingredients, trimmed],
      ingredientInput: "",
    }));
  };

  const removeIngredient = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((v) => v !== value),
    }));
  };

  const toggleAllergen = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(value)
        ? prev.allergens.filter((v) => v !== value)
        : [...prev.allergens, value],
    }));
  };

  // Customer Ordering Window — single-select: only one option at a time.
  const toggleWindow = (value: string) => {
    if (value.toLowerCase() === "all-day") return;
    setFormData((prev) => ({
      ...prev,
      orderingWindow: prev.orderingWindow === value ? "" : value,
    }));
  };

  const toggleMealTag = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mealTags: prev.mealTags.includes(value)
        ? prev.mealTags.filter((v) => v !== value)
        : [...prev.mealTags, value],
    }));
  };

  const addCustomTag = () => {
    const trimmed = formData.customTagInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      mealTags: prev.mealTags.includes(trimmed)
        ? prev.mealTags
        : [...prev.mealTags, trimmed],
      customTagInput: "",
    }));
  };

  // --- Image handling (resize/crop then upload) ---
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1536000) {
      setImageError("Image must be smaller than 1500KB");
      return;
    }

    setImageError("");
    setPendingCropFile(file);
    setIsCropperOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setIsCropperOpen(false);
    setPendingCropFile(null);
    // The backend's multipart limit is 1MB — the cropper exports a compact
    // JPEG, but guard here too so we never submit an oversized file.
    if (croppedFile.size > 1048576) {
      setImageError("The resized image is still too large. Try a smaller photo.");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedFile));
  };

  // --- Validation + preview ---
  const validate = (): string => {
    if (!formData.name.trim()) return "Meal name is required.";
    if (!formData.description.trim()) return "Description is required.";
    const price = Number(formData.price);
    if (!formData.price || Number.isNaN(price) || price <= 0) {
      return "Enter a valid price (greater than 0).";
    }
    if (!formData.category) return "Select a meal category.";
    if (!formData.preparationTime) return "Select the preparation time.";
    const servings = Number(formData.servings);
    if (!formData.servings || Number.isNaN(servings) || servings < 1) {
      return "Enter how many servings are available.";
    }
    if (formData.ingredients.length === 0) return "Add at least one ingredient.";
    if (!formData.orderingWindow) return "Select the customer ordering window.";
    if (!imageFile) return "Add a meal image (resize and upload it first).";
    return "";
  };

  const handleAddMealClick = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setIsPreviewOpen(true);
  };

  // Build the effective tag list: category + ordering window + meal tags.
  // The ordering window is persisted as a tag (string) so the backend stores
  // it and the View/Edit screens can read it back from the dish `tags` array.
  const buildTags = (): string[] => {
    const tags: string[] = [];
    if (formData.category === "Other" && formData.categoryCustom.trim()) {
      tags.push(formData.categoryCustom.trim());
    } else if (formData.category) {
      tags.push(formData.category);
    }
    if (formData.orderingWindow) tags.push(formData.orderingWindow);
    tags.push(...formData.mealTags);
    return tags;
  };

  const handleSubmitMeal = async () => {
    if (!vendorId) {
      setError("Vendor account could not be verified. Please reload and try again.");
      setIsPreviewOpen(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitStage("creating");
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        // The dedicated image endpoint attaches the image after creation,
        // so the create call goes out first and the image is uploaded next.
        imageUrl: "",
        fixedPrice: Number(formData.price),
        vendorId,
        ingredientsList: formData.ingredients.join(", "),
        preparationTime: formData.preparationTime,
        servings: Number(formData.servings),
        allergens: formData.allergens,
        tags: buildTags(),
      };

      const dish = await mealService.createDish(payload);

      if (imageFile) {
        setSubmitStage("uploading");
        await mealService.uploadDishImage(dish.id, imageFile);
      }

      setSubmittedDishName(dish.name || payload.name);
      setSubmitStage("");
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmitStage("");
      const message = err instanceof Error ? err.message : "Failed to create the meal. Please try again.";
      setIsPreviewOpen(false);
      setError(message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      categoryCustom: "",
      preparationTime: "",
      servings: "",
      ingredients: [],
      ingredientInput: "",
      allergens: [],
      orderingWindow: "",
      mealTags: [],
      customTagInput: "",
    });
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setImageError("");
    setSuccessMsg("");
    setError("");
    setIsPreviewOpen(false);
  };

  if (resolvingVendor) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-24 lg:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Meal</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Fill in the details below. Your meal will be reviewed by the platform before it is published.
      </p>

      {successMsg && (
        <div ref={successRef} className="cnc-message-rise p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium flex justify-between items-center">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none p-2">
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
          <button type="button" onClick={() => setError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleAddMealClick} className="space-y-4">
        {/* ===== Image Upload ===== */}
        <section className="admin-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-5 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FC6B31]" />
            Meal Image
          </h2>

          {imageError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
              <span>{imageError}</span>
              <button type="button" onClick={() => setImageError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {imagePreview ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-sm shrink-0 bg-gray-200 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Meal preview" className="w-full h-full object-cover" />
              </div>
              <div className="w-full flex flex-col items-start gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureChange}
                  accept="image/jpeg, image/png, image/gif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Choose a Different Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    setImagePreview("");
                  }}
                  className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 text-red-500 hover:text-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-10 px-6 flex flex-col items-center gap-3 hover:border-[#FC6B31] transition-colors group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                accept="image/jpeg, image/png, image/gif"
                className="hidden"
              />
              <span className="w-14 h-14 rounded-full bg-[#FC6B31]/10 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-[#FC6B31]" />
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#FC6B31]">
                Tap to upload a meal image
              </span>
              <span className="text-xs text-gray-500">JPG, GIF or PNG. Max 1500KB. Resize before upload.</span>
            </button>
          )}
        </section>

        {/* ===== Meal Details ===== */}
        <section className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FC6B31]" />
            Meal Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Meal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jollof Rice & Chicken"
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Short, appetising description of the meal..."
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 4500"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Available Servings <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="servings"
                  inputMode="numeric"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm appearance-none"
                >
                  <option value="" disabled>
                    Select Category...
                  </option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {formData.category === "Other" && (
                <input
                  type="text"
                  name="categoryCustom"
                  value={formData.categoryCustom}
                  onChange={handleChange}
                  placeholder="Type your category..."
                  className="mt-2 block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Preparation Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Timer className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm appearance-none"
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
          </div>
        </section>

        {/* ===== Ingredients ===== */}
        <section className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-[#FC6B31]" />
            Ingredients <span className="text-red-500 text-sm">*</span>
          </h2>

          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tap to add common ingredients:</p>
            <ChipToggleGroup options={QUICK_INGREDIENT_OPTIONS} selected={formData.ingredients} onToggle={toggleIngredient} />
          </div>

          <CustomChipAdder
            value={formData.ingredientInput}
            onChange={(value) => setFormData((prev) => ({ ...prev, ingredientInput: value }))}
            onAdd={addCustomIngredient}
            placeholder="Type another ingredient e.g. Groundnut oil"
          />

          {formData.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient) => (
                <SelectedChip key={ingredient} label={ingredient} onRemove={() => removeIngredient(ingredient)} />
              ))}
            </div>
          )}
        </section>

        {/* ===== Allergens ===== */}
        <section className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#FC6B31]" />
            Allergen Information
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select any allergens in this meal so customers can eat safely. Leave empty if none.
          </p>
          <ChipToggleGroup options={ALLERGEN_OPTIONS} selected={formData.allergens} onToggle={toggleAllergen} color="gray" />
        </section>

        {/* ===== Customer Ordering Window (single-select) ===== */}
        <section className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FC6B31]" />
            Customer Ordering Window
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            When can customers order this meal? Pick one ordering window.
          </p>
          <ChipToggleGroup options={[...CUSTOMER_ORDERING_WINDOW_OPTIONS]} selected={formData.orderingWindow ? [formData.orderingWindow] : []} onToggle={toggleWindow} color="gray" />
        </section>

        {/* ===== Meal Tags ===== */}
        <section className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-1 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#FC6B31]" />
            Meal Tags
          </h2>

          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Meal tags help customers find your meal:</p>
            <ChipToggleGroup options={MEAL_TAG_OPTIONS} selected={formData.mealTags} onToggle={toggleMealTag} color="gray" />
          </div>

          <CustomChipAdder
            value={formData.customTagInput}
            onChange={(value) => setFormData((prev) => ({ ...prev, customTagInput: value }))}
            onAdd={addCustomTag}
            placeholder="Add a custom tag e.g. Weekend special"
          />

          {formData.mealTags.filter((tag) => !MEAL_TAG_OPTIONS.includes(tag)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.mealTags
                .filter((tag) => !MEAL_TAG_OPTIONS.includes(tag))
                .map((tag) => (
                  <SelectedChip key={tag} label={tag} onRemove={() => toggleMealTag(tag)} />
                ))}
            </div>
          )}
        </section>

        {/* ===== Actions ===== */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(`/vendor/${email}/meals`)}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Meal
          </button>
        </div>
      </form>

      {/* ===== Preview Modal ===== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90dvh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#26292C] z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preview Meal</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitStage === "" && !submittedDishName ? (
              <div className="p-6 space-y-5">
                {imagePreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Meal preview" className="w-full h-48 object-cover" />
                  </div>
                )}

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Meal Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formData.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Price</p>
                      <p className="font-semibold text-[#FC6B31]">
                        ₦{Number(formData.price).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Servings</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formData.servings}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Category</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formData.category === "Other" ? formData.categoryCustom : formData.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Prep. Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formData.preparationTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Description</p>
                    <p className="text-gray-700 dark:text-gray-300">{formData.description}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.ingredients.map((ingredient) => (
                        <span key={ingredient} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-medium">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Allergens</p>
                      {formData.allergens.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.allergens.map((allergen) => (
                            <span key={allergen} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full px-3 py-1 text-xs font-medium">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">None</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Customer Ordering Window</p>
                      {formData.orderingWindow ? (
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-medium">
                            {formData.orderingWindow}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">None</p>
                      )}
                    </div>
                  </div>

                  {buildTags().length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {buildTags().map((tag) => (
                          <span key={tag} className="bg-[#FC6B31]/10 text-[#e35014] rounded-full px-3 py-1 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex gap-3">
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="flex-1 min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitMeal}
                    className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {isSubmitting ? "Submitting..." : "Submit Meal"}
                  </button>
                </div>
              </div>
            ) : submitStage !== "" ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FC6B31]" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {submitStage === "creating" ? "Creating your meal..." : "Uploading meal image..."}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {submitStage === "uploading" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-[#FC6B31]" />
                    )}
                    <span className={submitStage === "uploading" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                      Meal details
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {submitStage === "creating" ? (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <span className={submitStage === "creating" ? "text-gray-400" : "text-green-600 dark:text-green-400"}>
                      Meal image
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Meal Submitted!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {submittedDishName} has been sent for platform review. It will be published once approved.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={resetForm}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Meal
                  </button>
                  <button
                    onClick={() => {
                      setSuccessMsg(`${submittedDishName} was submitted successfully.`);
                      setIsPreviewOpen(false);
                      router.push(`/vendor/${email}/meals`);
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    View My Meals
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {pendingCropFile && (
        <ImageCropperModal
          imageFile={pendingCropFile}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setPendingCropFile(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
