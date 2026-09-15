import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DeliveryDropBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-orange-500/20">
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded-full">
          Next Delivery Drop
        </span>
        <p className="text-base font-bold">9:30 AM – 12:30 PM</p>
        <Link href="/explore" className="inline-flex items-center gap-1 text-xs font-semibold underline pt-1 hover:text-orange-100 transition-colors">
          Order now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="w-16 h-16 rounded-full border-2 border-white/40 overflow-hidden shadow-inner flex-shrink-0 bg-white">
        <img 
          src="/hero-food-illustration.png" 
          alt="Fresh Meal" 
          className="w-full h-full object-cover" 
          onError={(e) => {
            // Fallback if the image doesn't exist yet
            e.currentTarget.src = "https://placehold.co/100x100/orange/white?text=Food";
          }}
        />
      </div>
    </div>
  );
}