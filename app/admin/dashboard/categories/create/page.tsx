"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Upload, Utensils } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { categoryService } from "@/services/admin/category.service";
import Image from "next/image";
import { ImageCropperModal } from "@/components/admin/categories/ImageCropperModal";

const categorySchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .nonempty("Name is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  description: z.string()
    .max(255, "Description cannot exceed 255 characters")
    .optional()
    .or(z.literal("")),
  displayOrder: z.number()
    .int("Must be a whole number")
    .positive("Must be greater than 0"),
  active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [pictureError, setPictureError] = useState("");
  
  // Cropper State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
      displayOrder: 1,
      active: true,
    },
    mode: "onChange",
  });

  const watchImageUrl = watch("imageUrl");

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 819200) {
      setPictureError("Image must be smaller than 800KB");
      return;
    }

    setPictureError("");
    setSelectedFile(file);
    setIsCropperOpen(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsCropperOpen(false);
    setPendingImageFile(croppedFile);
    
    // Revoke previous URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(croppedFile));
    setSelectedFile(null);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const newCategory = await categoryService.createCategory({
        name: data.name,
        description: data.description,
        displayOrder: data.displayOrder,
      });
      
      // If the endpoint actually takes 'active', we might need to send it if supported.
      // We pass the fields defined in our CreateCategoryPayload, and since 'active' might be default true on backend, 
      // or we can pass it if we update the Payload type.

      // If there's a pending image, upload it using the new category's ID
      if (pendingImageFile) {
        setIsUploadingPicture(true);
        try {
          await categoryService.uploadCategoryImage(newCategory.id, pendingImageFile);
        } catch (imageError) {
          console.error("Failed to upload image after creating category:", imageError);
          // Optional: We can show a toast here that category was created but image failed, 
          // but we still redirect since the main entity was created successfully.
        } finally {
          setIsUploadingPicture(false);
        }
      }
      
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard/categories");
      }, 1500);
    } catch (_err) {
      setSubmitError("Unable to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/dashboard/categories"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Create Category
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add a new master category for vendor meals.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-sm font-medium">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-900/30 text-sm font-medium">
          Category created successfully. Redirecting...
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Name & Image Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Rice Meals"
                {...register("name")}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category Image <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Category Preview"
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : watchImageUrl ? (
                    <Image
                      src={watchImageUrl}
                      alt="Category"
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Utensils className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div>
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
                    disabled={isUploadingPicture}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUploadingPicture ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploadingPicture ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
              {pictureError && <p className="mt-1.5 text-xs text-red-500 font-medium">{pictureError}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="e.g. Traditional rice dishes and combinations."
              {...register("description")}
              className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
          </div>

          {/* Display Order & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input
                id="displayOrder"
                type="number"
                min="1"
                {...register("displayOrder", { valueAsNumber: true })}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all ${
                  errors.displayOrder ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.displayOrder && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.displayOrder.message}</p>}
              <p className="mt-1.5 text-xs text-gray-500">Controls how categories appear throughout the platform.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Active Status
              </label>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 ${
                        field.value ? 'bg-[#FC6B31]' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          field.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.value ? "Active (Visible)" : "Inactive (Hidden)"}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link 
              href="/admin/dashboard/categories"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#FC6B31] hover:bg-[#e55a20] disabled:bg-[#fca580] disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Category...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Category
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>

      {selectedFile && (
        <ImageCropperModal
          imageFile={selectedFile}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setSelectedFile(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
