// components/landing/HowItWorks.tsx
'use client';

import Image from 'next/image';
import { Bell, Timer, Bike } from 'lucide-react';

function FeatureListItem({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6633]/10 text-[#FF6633]">
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="text-[14px] text-[#555F66] dark:text-gray-400 font-medium leading-tight max-w-[200px]">
        {text}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full flex flex-col items-center pt-8 md:pt-0 pb-16 md:pb-24 px-4 md:px-[10px] bg-white dark:bg-background">
      
      <div className="w-full max-w-[1281px] h-[70px] md:h-[90px] bg-[#FF6633] rounded-[20px] md:rounded-[24px] flex items-center justify-center mb-8 md:mb-12 shadow-sm">
        <h2 className="text-white text-[24px] md:text-[32px] font-semibold leading-none tracking-[-0.02em]">
          How it Works
        </h2>
      </div>

      <div className="w-full max-w-[1281px] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">

        <div className="md:col-span-4 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col relative overflow-hidden min-h-[420px] md:min-h-0 md:h-[391px]">
          <div className="relative z-10">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 1: You Order</h3>
            <p className="text-[#555F66] dark:text-gray-400 leading-tight">Choose your meals and pay before time</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[280px]">
            <Image src="/Lady-at-table-with-phone.png" alt="Woman ordering on phone" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain object-bottom" priority />
          </div>
        </div>

        <div className="md:col-span-8 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row relative overflow-hidden min-h-[450px] md:min-h-0 md:h-[391px]">
          <div className="w-full md:w-1/2 relative z-10 flex flex-col">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 2: We Cook</h3>
            <p className="text-[#555F66] dark:text-gray-400 mb-8 max-w-sm leading-tight">Meals are prepared only after orders are confirmed</p>
            <div className="flex flex-col gap-6">
              <FeatureListItem icon={Bell} text="Place your orders" />
              <FeatureListItem icon={Timer} text="We confirm and start your food preparation." />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full md:w-[60%] h-[250px] md:h-[110%] md:-bottom-4">
            <Image src="/Chef-stirring-pot.png" alt="Chef cooking food" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-contain object-right-bottom md:object-right" priority />
          </div>
        </div>

        <div className="md:col-span-8 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row relative overflow-hidden min-h-[450px] md:min-h-0 md:h-[391px]">
           <div className="w-full md:w-1/2 relative z-10 flex flex-col">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 3: We Deliver</h3>
            <p className="text-[#555F66] dark:text-gray-400 mb-8 max-w-sm leading-tight">Riders deliver in optimised batches within a time window.</p>
            <div className="flex flex-col gap-5">
              <FeatureListItem icon={Bell} text="Place your orders" />
              <FeatureListItem icon={Timer} text="We confirm and start your food preparation." />
              <FeatureListItem icon={Bike} text="The rider picks it up, and is on the way" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full md:w-[55%] h-[250px] md:h-[110%] md:-bottom-4">
            <Image src="/Rider.png" alt="Delivery rider on motorcycle" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-contain object-right-bottom" priority />
          </div>
        </div>

        <div className="md:col-span-4 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col relative overflow-hidden min-h-[420px] md:min-h-0 md:h-[391px]">
          <div className="relative z-10">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 4: You Enjoy</h3>
            <p className="text-[#555F66] dark:text-gray-400 leading-tight">Fresh, delicious meals delivered right on schedule.</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[280px]">
            <Image src="/lady_eating_food.png" alt="Woman enjoying a meal" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain object-bottom" priority />
          </div>
        </div>

      </div>
    </section>
  );
}