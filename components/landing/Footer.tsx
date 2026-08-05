// components/landing/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

const InstagramIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const PinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.5 6.5 12 7 12.5.5-.5 7-7 7-12.5C18.5 5.36 15.14 2 12 2zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">

      {/* 10% Opacity Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image 
          src="/bg_overlay.png" 
          alt="Street Background Overlay" 
          fill 
          className="object-cover object-bottom" 
          quality={100}
        />
      </div>

      {/* Content wrapper with background */}
      <div className="relative z-10 bg-[#FFF7F5] pt-8 md:pt-12">
        {/* Main Section */}
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-20">

        <div className="relative z-10 grid grid-cols-1 gap-8 pb-[180px] sm:grid-cols-2 sm:gap-10 md:grid-cols-4 md:gap-6 lg:grid-cols-[2.3fr_1fr_1.3fr_1fr] lg:gap-8 lg:pb-[220px] xl:pb-[280px]">

          {/* Brand */}
          <div className="max-w-full md:max-w-[340px]">
            <Link href="/" className="inline-block">
              <Image
                src="/Chopnchop.png"
                alt="Chop n Chop"
                width={170}
                height={40}
                className="mb-4 h-7 w-auto sm:mb-5 md:mb-6 md:h-8"
                priority
              />
            </Link>

            <h3 className="mb-2 text-[18px] font-bold leading-tight text-[#3E3D42] sm:text-[19px] md:mb-3 md:text-[20px]">
              Fresh cooked meals. Delivered smarter.
            </h3>

            <p className="mb-4 text-[15px] leading-6 text-[#555F66] sm:leading-relaxed md:mb-6 md:text-[16px] md:leading-7">
              Skip the cooking. Skip the wait. Order today&apos;s drop and enjoy chef-prepared meals delivered right on time.
            </p>

            <div className="flex items-center gap-2 text-[14px] font-medium sm:text-[15px]">
              <PinIcon size={16} />
              <span className="text-[#FC6B31]">Lagos, Nigeria</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Explore
            </h4>

            <nav className="flex flex-col gap-2.5 text-[15px] text-[#555F66] sm:gap-3 md:text-[16px]">
              <Link href="#" className="hover:text-[#FC6B31] transition-colors">
                How It Works
              </Link>
              <Link href="#" className="hover:text-[#FC6B31] transition-colors">
                Today&apos;s Drop
              </Link>
              <Link href="#" className="hover:text-[#FC6B31] transition-colors">
                FAQs
              </Link>
              <Link href="#" className="hover:text-[#FC6B31] transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Contact
            </h4>

            <div className="flex flex-col gap-3 text-[15px] text-[#555F66] sm:gap-3.5 md:gap-4 md:text-[16px]">
              <p>+234 817 202 8728</p>
              <p className="break-words">chopnchop.system@gmail.com</p>
              <p className="leading-relaxed">
                Monday – Saturday
                <br />
                8:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Follow Us
            </h4>

            <div className="mb-3 flex gap-4 text-[#555F66] md:mb-4">
              <Link href="#" className="hover:text-[#FC6B31] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </Link>
              <Link href="#" className="hover:text-[#FC6B31] transition-colors" aria-label="X (Twitter)">
                <XIcon />
              </Link>
              <Link href="#" className="hover:text-[#FC6B31] transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </Link>
            </div>

            <p className="text-[15px] text-[#555F66] md:text-[16px]">
              @chopnchop_ng
            </p>
          </div>

        </div>

        {/* Watermark */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 select-none overflow-visible whitespace-nowrap">
          <span
            className="bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(80px, 18vw, 220px)',
              fontWeight: 700,
              letterSpacing: '-0.08em',
              lineHeight: 1.1,
              backgroundImage: 'linear-gradient(179deg, #FC6B31 0%, #FFF7F5 127%)',
            }}
          >
            Chop n&apos; chop
          </span>
        </div>
      </div>

        {/* Bottom Bar */}
      <div className="relative z-20 flex justify-center px-4">
        <div className="flex h-auto w-full max-w-[1273px] flex-col items-center justify-between gap-3 bg-[#FC6B31] px-4 py-4 text-white sm:flex-row sm:gap-4 sm:px-6 md:h-[55px] md:px-8 lg:px-12">

          <p className="text-center text-xs sm:text-left sm:text-sm">
            © 2026 Chop&apos;n Chop. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm md:gap-4">
            <Link href="/admin/login" className="hover:underline">Admin</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/cookie" className="hover:underline">Cookie Policy</Link>
          </nav>

        </div>
      </div>
      </div>

    </footer>
  );
}