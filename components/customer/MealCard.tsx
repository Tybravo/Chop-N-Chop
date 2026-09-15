import Link from "next/link";
import { Plus } from "lucide-react";

interface MealCardProps {
  id: string;
  name: string;
  vendor: string;
  price: number;
  imageUrl?: string;
}

export default function MealCard({ id, name, vendor, price, imageUrl }: MealCardProps) {
  return (
    // FIX: Added 'h-full' here so the link stretches to fill the carousel row perfectly
    <Link href={`/customer/meal/${id}`} className="block group h-full">
      <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-black/30 border border-gray-50 dark:border-zinc-800 transition-all group-hover:shadow-md relative flex flex-col h-full w-full">
        
        {/* Food Image Container */}
        {/* FIX: Added 'shrink-0' so the image always stays a perfect square and never squishes vertically */}
        <div className="w-full aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl mb-3 flex items-center justify-center overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <span className="text-2xl font-bold text-gray-300 dark:text-zinc-700">Food</span>
          )}
        </div>
        
        {/* Text & Details */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-[#FC6B31] transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{vendor}</p>
          
          {/* 'mt-auto' forces this bottom row to lock perfectly to the bottom of the card, aligning all '+' buttons! */}
          <div className="mt-auto flex items-center justify-between">
            <span className="font-extrabold text-[15px] text-gray-900 dark:text-white">
              ₦{price.toLocaleString()}
            </span>
            
            <button 
              onClick={(e) => {
                e.preventDefault(); 
                console.log(`Added ${name} to cart`);
              }}
              className="w-8 h-8 rounded-full bg-[#FC6B31] flex items-center justify-center text-white shadow-sm hover:bg-orange-600 transition-colors active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}