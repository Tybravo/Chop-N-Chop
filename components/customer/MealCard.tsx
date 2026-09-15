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
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-3 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/meals/${id}`} className="block relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800">
        <img 
          src={imageUrl || "https://placehold.co/200x200/orange/white?text=Food"} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </Link>
      
      <div className="flex-1">
        <Link href={`/meals/${id}`}>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">{name}</h3>
        </Link>
        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{vendor}</p>
      </div>
      
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50 dark:border-zinc-800/50">
        <span className="text-sm font-extrabold text-gray-900 dark:text-white">₦{price.toLocaleString()}</span>
        <button className="w-6 h-6 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}