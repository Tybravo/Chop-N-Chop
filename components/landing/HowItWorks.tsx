// components/landing/HowItWorks.tsx
'use client';

import Image from 'next/image';
import { Bell, Timer, Bike, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

function FeatureListItem({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center gap-4 z-20 relative">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6633]/10 text-[#FF6633]">
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="text-[14px] text-[#555F66] dark:text-gray-400 font-medium leading-tight">
        {text}
      </p>
    </div>
  );
}

const steps = [
  {
    id: 1,
    title: "Step 1: You Order",
    description: "Choose your meals and pay before time",
    image: "/Lady-at-table-with-phone.png",
    imageAlt: "Woman ordering on phone",
    hasFeatures: false,
  },
  {
    id: 2,
    title: "Step 2: We Cook",
    description: "Meals are prepared only after orders are confirmed",
    image: "/Chef-stirring-pot.png",
    imageAlt: "Chef cooking food",
    hasFeatures: true,
    features: [
      { icon: Bell, text: "Place your orders" },
      { icon: Timer, text: "We confirm and start your food preparation." },
    ],
  },
  {
    id: 3,
    title: "Step 3: We Deliver",
    description: "Riders deliver in optimised batches within a time window.",
    image: "/Rider.png",
    imageAlt: "Delivery rider on motorcycle",
    hasFeatures: true,
    features: [
      { icon: Bell, text: "Place your orders" },
      { icon: Timer, text: "We confirm and start your food preparation." },
      { icon: Bike, text: "The rider picks it up, and is on the way" },
    ],
  },
  {
    id: 4,
    title: "Step 4: You Enjoy",
    description: "Fresh, delicious meals delivered right on schedule.",
    image: "/lady_eating_food.png",
    imageAlt: "Woman enjoying a meal",
    hasFeatures: false,
  },
];

export default function HowItWorks() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollToSlide = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (container && container.clientWidth > 0) {
      const slideWidth = container.clientWidth;
      container.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      setCurrentSlide(index);
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container && container.clientWidth > 0) {
        const nextIndex = currentSlide === steps.length - 1 ? 0 : currentSlide + 1;
        const slideWidth = container.clientWidth;
        container.scrollTo({ left: slideWidth * nextIndex, behavior: 'smooth' });
        setCurrentSlide(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const slideWidth = container.clientWidth;
      if (slideWidth === 0) return;
      const index = Math.round(container.scrollLeft / slideWidth);
      setCurrentSlide(Math.max(0, Math.min(index, steps.length - 1)));
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    if (currentSlide < steps.length - 1) {
      scrollToSlide(currentSlide + 1);
    } else {
      scrollToSlide(0);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    } else {
      scrollToSlide(steps.length - 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section id="how-it-works" className="w-full flex flex-col items-center pt-8 md:pt-0 pb-16 md:pb-24 px-4 md:px-[10px] bg-white dark:bg-background">
      
      <div className="w-full max-w-[1281px] h-[70px] md:h-[90px] bg-[#FF6633] rounded-[20px] md:rounded-[24px] flex items-center justify-center mb-8 md:mb-12 shadow-sm">
        <h2 className="text-white text-[24px] md:text-[32px] font-semibold leading-none tracking-[-0.02em]">
          How It Works
        </h2>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid w-full max-w-[1281px] grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 px-0 md:px-[85px]">

        <div className="md:col-span-4 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col relative overflow-hidden h-auto md:h-[391px]">
          <div className="relative z-20 pb-[260px] md:pb-0">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 1: You Order</h3>
            <p className="text-[#555F66] dark:text-gray-400 leading-tight">Choose your meals and pay before time</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[280px] z-10 pointer-events-none">
            <Image src="/Lady-at-table-with-phone.png" alt="Woman ordering on phone" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain object-bottom" priority />
          </div>
        </div>

        <div className="md:col-span-8 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row relative overflow-hidden h-auto md:h-[391px]">
          <div className="w-full md:w-1/2 relative z-20 flex flex-col pb-[240px] md:pb-0">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 2: We Cook</h3>
            <p className="text-[#555F66] dark:text-gray-400 mb-8 max-w-sm leading-tight">Meals are prepared only after orders are confirmed</p>
            <div className="flex flex-col gap-6">
              <FeatureListItem icon={Bell} text="Place your orders" />
              <FeatureListItem icon={Timer} text="We confirm and start your food preparation." />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full md:w-[60%] h-[250px] md:h-[110%] md:-bottom-4 z-10 pointer-events-none">
            <Image src="/Chef-stirring-pot.png" alt="Chef cooking food" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-contain object-right-bottom md:object-right" priority />
          </div>
        </div>

        <div className="md:col-span-8 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row relative overflow-hidden h-auto md:h-[391px]">
           <div className="w-full md:w-1/2 relative z-20 flex flex-col pb-[240px] md:pb-0">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 3: We Deliver</h3>
            <p className="text-[#555F66] dark:text-gray-400 mb-8 max-w-sm leading-tight">Riders deliver in optimised batches within a time window.</p>
            <div className="flex flex-col gap-5">
              <FeatureListItem icon={Bell} text="Place your orders" />
              <FeatureListItem icon={Timer} text="We confirm and start your food preparation." />
              <FeatureListItem icon={Bike} text="The rider picks it up, and is on the way" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full md:w-[55%] h-[250px] md:h-[110%] md:-bottom-4 z-10 pointer-events-none">
            <Image src="/Rider.png" alt="Delivery rider on motorcycle" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-contain object-right-bottom" priority />
          </div>
        </div>

        <div className="md:col-span-4 bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 md:p-10 flex flex-col relative overflow-hidden h-auto md:h-[391px]">
          <div className="relative z-20 pb-[260px] md:pb-0">
            <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">Step 4: You Enjoy</h3>
            <p className="text-[#555F66] dark:text-gray-400 leading-tight">Fresh, delicious meals delivered right on schedule.</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[280px] z-10 pointer-events-none">
            <Image src="/lady_eating_food.png" alt="Woman enjoying a meal" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain object-bottom" priority />
          </div>
        </div>

      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden w-full max-w-[1281px] relative overflow-hidden">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide gap-0 touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {steps.map((step) => (
            <div 
              key={step.id}
              className="w-full flex-shrink-0 snap-center bg-[#FFF7F5] dark:bg-gray-900 rounded-[20px] p-6 flex flex-col h-[480px]"
            >
              <div className="relative z-20 flex-shrink-0">
                <h3 className="text-[#FF6633] text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[#555F66] dark:text-gray-400 leading-tight mb-4">{step.description}</p>
                {step.hasFeatures && (
                  <div className="flex flex-col gap-4 mb-2">
                    {step.features?.map((feature, idx) => (
                      <FeatureListItem key={idx} icon={feature.icon} text={feature.text} />
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1 w-full z-10 pointer-events-none mt-2">
                <Image src={step.image} alt={step.imageAlt} fill sizes="100vw" className="object-contain object-bottom" priority={step.id === 1} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-2 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center transition-all ${
            currentSlide === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'opacity-100 hover:bg-white dark:hover:bg-gray-800'
          }`}
          aria-label="Previous step"
        >
          <ChevronLeft className="w-5 h-5 text-[#FF6633]" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === steps.length - 1}
          className={`absolute right-2 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center transition-all ${
            currentSlide === steps.length - 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'opacity-100 hover:bg-white dark:hover:bg-gray-800'
          }`}
          aria-label="Next step"
        >
          <ChevronRight className="w-5 h-5 text-[#FF6633]" />
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-[#FF6633] w-6' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}