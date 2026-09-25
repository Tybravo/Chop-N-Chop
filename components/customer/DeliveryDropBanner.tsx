"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";

// --- API Types aligned with Swagger Documentation ---
interface TimeObj {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface DropSlot {
  id: string;
  startTime: TimeObj;
  endTime: TimeObj;
  full: boolean;
}

interface DailyDrop {
  id: string;
  date: string;
  openTime: string;
  closeTime: string;
  status: string;
  slots: DropSlot[];
}

// Utility to convert the Java-style LocalTime object into a readable 12-hour AM/PM string
const formatTime = (timeObj: TimeObj) => {
  if (!timeObj) return "";
  const h = timeObj.hour;
  const m = timeObj.minute;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  const formattedMin = m.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMin} ${ampm}`;
};

export default function DeliveryDropBanner() {
  const [timeWindow, setTimeWindow] = useState<string>("Fetching slots...");
  const [hasDrops, setHasDrops] = useState<boolean>(true);

  useEffect(() => {
    const fetchNextDrop = async () => {
      try {
        const res = await customerApiClient.get("/api/v1/drops/today");
        const data: DailyDrop = res.data;

        if (data && data.slots && data.slots.length > 0) {
          // Look for the first slot that isn't fully booked, or default to the first slot available
          const availableSlot = data.slots.find(slot => !slot.full) || data.slots[0];
          const windowStr = `${formatTime(availableSlot.startTime)} - ${formatTime(availableSlot.endTime)}`;
          setTimeWindow(windowStr);
        } else {
          setTimeWindow("No more drops today");
          setHasDrops(false);
        }
      } catch (error) {
        console.error("Failed to fetch drop banner data:", error);
        setTimeWindow("Check available drops"); // Graceful fallback on error
      }
    };

    fetchNextDrop();
  }, []);

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
          {hasDrops ? "Next Delivery Drop" : "Drop Status"}
        </span>
        
        {/* whitespace-nowrap prevents the link from ever dropping to a second line */}
        <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
          <p className="text-[13px] sm:text-[14px] font-bold tracking-tight">
            {timeWindow}
          </p>
          
          {/* Only show the 'Order now' link if there are active drops */}
          {hasDrops && (
            <>
              {/* Vertical divider line */}
              <div className="w-[1px] h-3.5 bg-white/40 rounded-full shrink-0 mx-0.5" />
              
              <Link href="/customer/explore" className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold hover:text-orange-100 transition-colors">
                Order now <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </>
          )}
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