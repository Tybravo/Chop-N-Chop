import { useState, useEffect, useRef } from "react";
import { Loader2, X, Upload, Utensils } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { MealCategory } from "@/types/category";
import { categoryService } from "@/services/admin/category.service";
import { ImageCropperModal } from "./ImageCropperModal";

const editCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).trim().nonempty("Name is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  description: z.string().max(255).optional().or(z.literal("")),
  displayOrder: z.number().int().positive(),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

interface EditCategoryModalProps {
  category: MealCategory;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCategory: MealCategory) => void;
}

export function EditCategoryModal({ category, isOpen, onClose, onSuccess }: EditCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
      imageUrl: category.imageUrl || category.icon || "",
      description: category.description || "",
      displayOrder: category.displayOrder || 1,
    },
    mode: "onChange",
  });

  const watchImageUrl = watch("imageUrl");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: category.name,
        imageUrl: category.imageUrl || category.icon || "",
        description: category.description || "",
        displayOrder: category.displayOrder || 1,
      });
      setSubmitError(null);
      setPictureError("");
      setPendingImageFile(null);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id, isOpen, reset]);

  if (!isOpen) return null;

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1536000) {
      setPictureError("Image must be smaller than 1500KB");
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

  const onSubmit = async (data: EditCategoryFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updated = await categoryService.updateCategory(category.id, {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl, // Existing URL, though the backend might not need it if updating is handled separately. We'll pass it for safety.
        displayOrder: data.displayOrder,
      });

      // If there's a pending image, upload it using the category's ID
      if (pendingImageFile) {
        setIsUploadingPicture(true);
        try {
          const newImageUrl = await categoryService.uploadCategoryImage(category.id, pendingImageFile);
          // Mutate the returned object to include the new image URL so the parent list updates immediately
          updated.imageUrl = newImageUrl;
        } catch (imageError) {
          console.error("Failed to upload image after updating category:", imageError);
        } finally {
          setIsUploadingPicture(false);
        }
      }

      onSuccess(updated);
    } catch (_err) {
      setSubmitError("Unable to update category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
              {submitError}
            </div>
          )}

          <form id="edit-category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                {...register("name")}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category Image
              </label>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Category Preview" fill sizes="64px" className="object-cover" unoptimized />
                  ) : watchImageUrl ? (
                    <Image src={watchImageUrl} alt="Category" fill sizes="64px" className="object-cover" unoptimized />
                  ) : (
                    <Utensils className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div>
                  <input type="file" ref={fileInputRef} onChange={handlePictureChange} accept="image/jpeg, image/png, image/gif" className="hidden" />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPicture}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-70"
                  >
                    {isUploadingPicture ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploadingPicture ? "Uploading..." : "Change Image"}
                  </button>
                </div>
              </div>
              {pictureError && <p className="mt-1.5 text-xs text-red-500 font-medium">{pictureError}</p>}
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                id="edit-description"
                rows={3}
                {...register("description")}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="edit-displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-displayOrder"
                type="number"
                min="1"
                {...register("displayOrder", { valueAsNumber: true })}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all ${
                  errors.displayOrder ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.displayOrder && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.displayOrder.message}</p>}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-black/20">
          <button onClick={onClose} type="button" className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-category-form"
            disabled={!isValid || isSubmitting}
            className="px-5 py-2 rounded-lg font-medium bg-[#FC6B31] text-white hover:bg-[#e55a20] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
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
