import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DeliveryDropBanner() {
  return (
    <div 
      // Fixed height of 92px exactly as in Figma, no shrinking allowed
      className="relative rounded-[10px] text-white overflow-hidden flex items-center h-[92px] w-full shrink-0"
      style={{ 
        backgroundColor: '#FC6B31',
        boxShadow: '0px 4px 18.5px 0px rgba(0, 0, 0, 0.25)' 
      }}
    >
      
      {/* Left Content Area */}
      <div className="pl-4 py-3 relative z-20 flex flex-col justify-center w-full">
        <span className="text-[10px] font-normal opacity-90 block mb-1 whitespace-nowrap">
          Next Delivery Drop
        </span>
        
        {/* ADDED: whitespace-nowrap prevents the link from ever dropping to a second line */}
        <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
          <p className="text-[13px] sm:text-[14px] font-bold tracking-tight">9:30 AM - 12:30 PM</p>
          
          {/* Vertical divider line */}
          <div className="w-[1px] h-3.5 bg-white/40 rounded-full shrink-0 mx-0.5" />
          
          <Link href="/customer/explore" className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold hover:text-orange-100 transition-colors">
            Order now <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Right Image Container */}
      <div className="absolute right-0 inset-y-0 my-auto translate-x-3 sm:translate-x-4 w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] z-10 flex items-center shrink-0">
        <img 
          src="/hero-food-illustration.png" 
          alt="Fresh Meal Drop" 
          className="w-full h-full object-cover rounded-full"
          style={{
            boxShadow: '-6px 9px 22.8px 0px rgba(0, 0, 0, 0.25)'
          }}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/orange/white?text=Food"; }}
        />
      </div>
      
    </div>
  );
}