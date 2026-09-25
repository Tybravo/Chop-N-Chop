import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { MealCategory } from "@/types/category";
import { categoryService } from "@/services/admin/category.service";

interface DeleteCategoryModalProps {
  category: MealCategory;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedCategoryId: string) => void;
}

export function DeleteCategoryModal({ category, isOpen, onClose, onSuccess }: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await categoryService.deleteCategory(category.id);
      onSuccess(category.id);
    } catch (_err) {
      setDeleteError("Unable to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 text-center pt-8">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Category</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm px-4">
            Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">&quot;{category.name}&quot;</span>? 
            This action cannot be undone, though it will be softly removed from the system.
          </p>

          {deleteError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
              {deleteError}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col-reverse sm:flex-row gap-3 justify-center bg-gray-50/50 dark:bg-black/20">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
