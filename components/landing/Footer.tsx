// components/landing/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react'; 

// Custom SVG for Instagram
const InstagramIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number, strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom SVG for X (Twitter)
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom SVG for TikTok
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#FFF7F5] dark:bg-gray-950 pt-16 md:pt-20 flex flex-col items-center overflow-hidden">
      
      <div className="relative z-10 w-full max-w-[1281px] px-6 md:px-[80px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-[80px] md:pb-[140px]">
        
        <div className="sm:col-span-2 md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left">
          <Link href="/">
            <Image src="/Chopnchop.png" alt="Chop n Chop Text" width={140} height={36} className="w-auto h-7 md:h-8 object-contain mb-6" />
          </Link>
          <h3 className="text-[20px] font-bold text-[#3E3D42] dark:text-white mb-2 leading-tight">
            Fresh cooked meals. Delivered smarter.
          </h3>
          <p className="text-[15px] text-[#555F66] dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
            Skip the cooking. Skip the wait. Order today&apos;s drop and enjoy chef-prepared meals delivered right on time.
          </p>
          <div className="flex items-center gap-2 text-[#3E3D42] dark:text-gray-300 font-medium">
            <MapPin size={18} className="text-[#FF6633]" />
            <span className="text-[15px]">Lagos, Nigeria</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start md:col-span-2">
          <h4 className="text-[17px] font-bold text-[#3E3D42] dark:text-white mb-4">Explore</h4>
          <div className="flex flex-col gap-3 text-[15px] text-[#555F66] dark:text-gray-400 items-center md:items-start">
            <Link href="#how-it-works" className="hover:text-[#FF6633] transition-colors">How It Works</Link>
            <Link href="#todays-drop" className="hover:text-[#FF6633] transition-colors">Today&apos;s Drop</Link>
            <Link href="#faqs" className="hover:text-[#FF6633] transition-colors">FAQs</Link>
            <Link href="#contact-us" className="hover:text-[#FF6633] transition-colors">Contact Us</Link>
          </div>
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left md:col-span-3">
          <h4 className="text-[17px] font-bold text-[#3E3D42] dark:text-white mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-[15px] text-[#555F66] dark:text-gray-400">
            <p>Tel: +234 817 202 8728</p>
            <p>Email Address: chopnchop.system@gmail.com</p>
            <p className="mt-2">
              Days & Time: Monday – Saturday<br />
              8:00 AM – 6:00 PM
            </p>
          </div>
        </div>
  
        <div className="flex flex-col items-center md:items-start md:col-span-2">
          <h4 className="text-[17px] font-bold text-[#3E3D42] dark:text-white mb-4">Follow Us</h4>
          <div className="flex items-center gap-4 text-[#555F66] dark:text-gray-400 mb-2">
            <a href="#" className="hover:text-[#FF6633] transition-colors" aria-label="Instagram"><InstagramIcon size={22} /></a>
            <a href="#" className="hover:text-[#FF6633] transition-colors" aria-label="X (Twitter)"><XIcon size={20} /></a>
            <a href="#" className="hover:text-[#FF6633] transition-colors" aria-label="TikTok"><TikTokIcon size={22} /></a>
          </div>
          <p className="text-[15px] text-[#555F66] dark:text-gray-400">@chopnchop_ng</p>
        </div>

      </div>

      {/* FIXED FIGMA TYPOGRAPHY */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 flex justify-center pointer-events-none select-none w-full">
        <span 
          className="whitespace-nowrap bg-gradient-to-b from-[#FC6B31] to-[#FFF7F5] dark:to-gray-950 bg-clip-text text-transparent"
          style={{
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(60px, 16vw, 200px)',
            letterSpacing: '-0.08em',
            lineHeight: '1',
          }}
        >
          Chop n&apos; chop
        </span>
      </div>

      <div className="relative z-20 w-full flex justify-center px-4 sm:px-10 md:px-0">
        <div className="w-full max-w-[1273px] bg-[#FF6633] text-white flex flex-col md:flex-row items-center justify-between py-4 md:py-[18px] px-4 md:px-[40px] lg:px-[48px]">
          
          <div className="text-[12px] md:text-[14px] font-medium mb-3 md:mb-0 text-center">
            © 2026 Chop&apos;n Chop. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[12px] md:text-[14px] font-medium">
            <Link href="/admin/login" className="hover:text-white/80 transition-colors whitespace-nowrap">Admin</Link>
            <span className="text-white/70">|</span>
            <Link href="/privacy" className="hover:text-white/80 transition-colors whitespace-nowrap">Privacy Policy</Link>
            <span className="text-white/70">|</span>
            <Link href="/terms" className="hover:text-white/80 transition-colors whitespace-nowrap">Terms & Conditions</Link>
            <span className="text-white/70 hidden sm:inline">|</span>
            <Link href="/cookie" className="hover:text-white/80 transition-colors whitespace-nowrap">Cookie Policy</Link>
          </div>

        </div>
      </div>
      
    </footer>
  );
}