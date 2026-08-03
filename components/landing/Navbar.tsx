// components/landing/Navbar.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { PreOrderIcon } from './PreOrderIcon'; 

export default function Navbar() {
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useUiStore((state) => state.toggleCart);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex items-center justify-between w-full py-[20px] px-[80px] bg-background border-b border-[#E5E7EB] dark:border-secondary-light/20">
      
      {/* Logo - Side by side icon and text with optical alignment */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* The Bowl Icon - Scaled up for better visual presence */}
          <Image
            src="/logo_icon.png"                 
            alt="Chop n Chop Icon"
            width={44}
            height={44}
            className="w-auto h-8 md:h-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          {/* The Text Logo - Nudged down slightly (mt-1) to center perfectly with the bowl */}
          <Image
            src="/Chopnchop.png"                 
            alt="Chop n Chop Text"
            width={130}
            height={32}
            className="w-auto h-6 md:h-[26px] object-contain mt-1"
            priority
          />
        </Link>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
        <Link href="#how-it-works" className="hover:text-[#FF6633] transition-colors">
          How it works
        </Link>
        <Link href="#todays-drop" className="hover:text-[#FF6633] transition-colors">
          Today&apos;s drop
        </Link>
        <Link href="#faqs" className="hover:text-[#FF6633] transition-colors">
          FAQs
        </Link>
        <Link href="#contact-us" className="hover:text-[#FF6633] transition-colors">
          Contact Us
        </Link>
        <Link href="/vendor/login" className="hover:text-[#FF6633] transition-colors">
          Vendor
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <ThemeToggle />
        
        <button
          className="relative p-2 text-foreground hover:text-[#FF6633] hover:bg-[#FF6633]/10 rounded-full transition-colors"
          onClick={toggleCart}
          aria-label="Open cart"
        >
          <ShoppingCart size={24} />
          {mounted && getTotalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6633] text-[10px] font-bold text-white">
              {getTotalItems}
            </span>
          )}
        </button>

        {/* Order Now Button - Exactly matching Figma */}
        <button className="bg-[#FF6633] hover:bg-[#e55a2b] transition-colors text-white px-6 py-2.5 rounded-lg hidden sm:flex items-center gap-2 shadow-sm">
          <PreOrderIcon size={16} />
          <span className="font-semibold text-white tracking-[0.25px]">Order Now</span>
        </button>
      </div>
      
    </nav>
  );
}