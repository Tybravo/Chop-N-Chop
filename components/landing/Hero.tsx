// components/landing/Hero.tsx
'use client';

import Image from 'next/image';
import { ArrowRight, Soup, Clock, Package, Flame } from 'lucide-react';

interface StatusItemProps {
  icon: React.ElementType;
  title: string;
  text: string;
}

function StatusItem({ icon: Icon, title, text }: StatusItemProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4 text-left w-full md:w-auto">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF6633]/10 text-[#FF6633]">
        <Icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <h3 className="text-[14px] md:text-[15px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">
          {title}
        </h3>
        <p className="text-[12px] md:text-[13px] text-[#555F66] dark:text-gray-400">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-start w-full pt-10 md:pt-16 px-4 md:px-6 text-center bg-background overflow-hidden">
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-[1122px] gap-6 md:gap-8 mx-auto">
        
        {/* Headline - Scaled dynamically for mobile */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[128px] font-bold leading-[1.1] md:leading-[0.94] tracking-[-0.08em] text-[#3E3D42] dark:text-white">
          Fresh Cooked Meals.<br />
          Delivered <span className="text-[#FF6633]">Smarter</span>
        </h1>

        <p className="text-[16px] md:text-[20px] font-medium text-[#555F66] dark:text-gray-400 w-full max-w-[551px] leading-snug md:leading-none tracking-[-0.02em] md:tracking-[-0.08em] text-center mx-auto px-4 md:px-0">
          Order before the deadline, and get chef-prepared meals delivered in optimized batches. No delivery chaos. No unnecessary delays.
        </p>

        <button className="bg-[#FF6633] hover:bg-[#e55a2b] transition-colors text-white px-6 py-3 md:px-8 md:py-4 rounded-[12px] shadow-sm relative z-20 cursor-pointer flex items-center gap-2">
          <span className="flex items-center gap-2 font-semibold text-white tracking-[0.25px]">
            Order Today&apos;s Drop
            <ArrowRight size={20} strokeWidth={2.5} color="#FFFFFF" />
          </span>
        </button>

      </div>

      <div className="relative z-0 w-full max-w-[1122px] h-[250px] sm:h-[350px] md:h-[500px] -mt-[40px] md:-mt-[120px]">
        <Image
          src="/hero-food-illustration.png"
          alt="Fresh cooked meals including salad, chicken, and a drink"
          fill
          className="object-contain object-top"
          priority
        />
      </div>
      
      <div className="relative z-20 w-full max-w-[1122px] mx-auto -mt-10 md:-mt-16 mb-12 md:mb-16 bg-white dark:bg-gray-900 rounded-[20px] md:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 p-6 md:px-10 md:py-6">
        
        {/* Grid layout on mobile, inline-flex on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:flex md:flex-row md:items-center justify-between md:gap-10">
          <StatusItem icon={Soup} title="Today's Drop" text="Smoky Jollof & Chicken" />
          <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700" />
          <StatusItem icon={Clock} title="Order Window" text="8:00 AM - 1:00 PM" />
          <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700" />
          <StatusItem icon={Package} title="Delivery Window" text="1:00 PM - 3:00 PM" />
          <div className="hidden md:block w-px h-12 bg-gray-200 dark:bg-gray-700" />
          <StatusItem icon={Flame} title="Limited slots" text="Slots are filling up fast!" />
        </div>

      </div>
      
    </section>
  );
}