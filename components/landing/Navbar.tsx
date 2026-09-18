// components/landing/Navbar.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { PreOrderIcon } from './PreOrderIcon'; 

export default function Navbar() {
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useUiStore((state) => state.toggleCart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Using lg:px-[80px] so landscape phones don't lose horizontal space
  return (
    <nav className="relative z-50 flex items-center justify-between w-full py-4 px-4 md:py-[20px] lg:px-[80px] bg-background border-b border-[#E5E7EB] dark:border-secondary-light/20">
      
      {/* Logo */}
      <div className="flex-shrink-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo_icon.png"                 
            alt="Chop n Chop Icon"
            width={44}
            height={44}
            className="w-auto h-7 md:h-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <Image
            src="/Chopnchop.png"                 
            alt="Chop n Chop Text"
            width={130}
            height={32}
            className="w-auto h-5 md:h-[26px] object-contain mt-1"
            priority
          />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-foreground">
        <Link href="#how-it-works" className="hover:text-[#FF6633] transition-colors">How it works</Link>
        <Link href="#todays-drop" className="hover:text-[#FF6633] transition-colors">Today&apos;s drop</Link>
        <Link href="#faqs" className="hover:text-[#FF6633] transition-colors">FAQs</Link>
        <Link href="#contact-us" className="hover:text-[#FF6633] transition-colors">Contact Us</Link>
        <Link href="/vendor/login" className="hover:text-[#FF6633] transition-colors">Vendor</Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-6 z-50">
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

        <button className="bg-[#FF6633] hover:bg-[#e55a2b] transition-colors text-white px-6 py-2.5 rounded-lg hidden sm:flex items-center gap-2 shadow-sm">
          <PreOrderIcon size={16} />
          <span className="font-semibold text-white tracking-[0.25px]">Order Now</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-foreground hover:text-[#FF6633]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-[#E5E7EB] dark:border-gray-800 shadow-lg flex flex-col py-6 px-6 gap-6 lg:hidden z-40">
          <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#FF6633]">How it works</Link>
          <Link href="#todays-drop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#FF6633]">Today&apos;s drop</Link>
          <Link href="#faqs" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#FF6633]">FAQs</Link>
          <Link href="#contact-us" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#FF6633]">Contact Us</Link>
          <Link href="/vendor/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#FF6633]">Vendor Portal</Link>
          <button className="bg-[#FF6633] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm w-full mt-2">
            <PreOrderIcon size={16} />
            <span className="font-semibold text-white tracking-[0.25px]">Order Now</span>
          </button>
        </div>
      )}
    </nav>
  );
}