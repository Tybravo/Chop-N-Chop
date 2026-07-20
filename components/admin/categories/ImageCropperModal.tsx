import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  imageFile: File;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export function ImageCropperModal({ imageFile, isOpen, onClose, onCropComplete }: ImageCropperModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Cropper state
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Add a ref to store the object URL to avoid recreating it on every render
  const objectUrlRef = useRef<string | null>(null);

  // Output dimension
  const OUTPUT_SIZE = 800;

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const canvasSize = canvas.width;
    
    // We want the image to cover the canvas (cover behavior)
    const scale = Math.max(canvasSize / img.width, canvasSize / img.height) * zoom;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Calculate center with offset
    const cx = canvasSize / 2 + offset.x;
    const cy = canvasSize / 2 + offset.y;

    // Save context, draw image, restore
    ctx.save();
    
    // Draw semi-transparent background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Move to center, apply rotation/scale if needed, draw image centered
    ctx.translate(cx, cy);
    ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    
    ctx.restore();

    // Draw the crop overlay (a guide showing what will be cropped, in this case we crop the whole square)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvasSize, canvasSize);
  }, [zoom, offset]);

  useEffect(() => {
    if (imageFile && isOpen) {
      if (!objectUrlRef.current) {
        objectUrlRef.current = URL.createObjectURL(imageFile);
      }
      const url = objectUrlRef.current;
      
      setZoom(1);
      setOffset({ x: 0, y: 0 });

      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        imageRef.current = img;
        draw();
      };
    } else {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [imageFile, isOpen]); // Removed draw from dependencies to prevent infinite loops

  useEffect(() => {
    if (isOpen) {
      draw();
    }
  }, [draw, isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    const img = imageRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      // Create a hidden canvas for the final high-res output
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = OUTPUT_SIZE;
      finalCanvas.height = OUTPUT_SIZE;
      const ctx = finalCanvas.getContext('2d');

      if (!ctx) throw new Error("Could not get canvas context");

      // We need to map the visual scale to the output scale
      const visualCanvasSize = canvasRef.current?.width || 300;
      const scaleMultiplier = OUTPUT_SIZE / visualCanvasSize;

      const scale = Math.max(visualCanvasSize / img.width, visualCanvasSize / img.height) * zoom;
      const scaledWidth = img.width * scale * scaleMultiplier;
      const scaledHeight = img.height * scale * scaleMultiplier;

      const cx = (OUTPUT_SIZE / 2) + (offset.x * scaleMultiplier);
      const cy = (OUTPUT_SIZE / 2) + (offset.y * scaleMultiplier);

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      ctx.translate(cx, cy);
      ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

      // Convert to blob
      finalCanvas.toBlob((blob) => {
        if (!blob) {
          setIsProcessing(false);
          return;
        }
        
        // Ensure we maintain the file extension
        const extension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `cropped_${Date.now()}.${extension}`;
        
        const croppedFile = new File([blob], fileName, { 
          type: imageFile.type || 'image/jpeg',
          lastModified: Date.now()
        });

        setIsProcessing(false);
        onCropComplete(croppedFile);
      }, imageFile.type || 'image/jpeg', 0.9);

    } catch (err) {
      console.error("Error cropping image", err);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#26292C] rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image</h2>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            Drag to reposition. Use the slider to zoom.
          </p>

          {/* Canvas Container */}
          <div className="relative w-[300px] h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden touch-none cursor-move shadow-inner">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="absolute inset-0"
            />
          </div>

          {/* Zoom Slider */}
          <div className="w-full mt-6 flex items-center gap-4 px-2">
            <button 
              type="button"
              onClick={() => setZoom(prev => Math.max(1, prev - 0.1))}
              className="p-1 text-gray-400 hover:text-[#FC6B31] transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#FC6B31]"
            />
            <button 
              type="button"
              onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              className="p-1 text-gray-400 hover:text-[#FC6B31] transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-black/20">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            type="button" 
            className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop}
            disabled={isProcessing}
            className="px-5 py-2 rounded-lg font-medium bg-[#FC6B31] text-white hover:bg-[#e55a20] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isProcessing ? "Processing..." : "Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
