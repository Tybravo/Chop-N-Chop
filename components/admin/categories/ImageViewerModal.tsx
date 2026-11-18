"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageViewerModalProps {
  isOpen: boolean;
  imageUrl: string | null | undefined;
  alt?: string;
  onClose: () => void;
}

export function ImageViewerModal({ isOpen, imageUrl, alt = "Image", onClose }: ImageViewerModalProps) {
  // Close on Escape key; lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: "85vw", maxWidth: "60rem", height: "70vh", maxHeight: "75vh", aspectRatio: "1408 / 768" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* unoptimized + object-contain renders the original file with no quality loss */}
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="90vw"
          className="object-contain rounded-lg shadow-2xl"
          unoptimized
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close image viewer"
      >
        <X className="w-6 h-6" />
      </button>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
        Click outside or press ESC to close
      </p>
    </div>
  );
}