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

const PinIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <radialGradient id="redGloss" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff9999" />
        <stop offset="25%" stopColor="#e53935" />
        <stop offset="100%" stopColor="#8e0000" />
      </radialGradient>
      <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7a7a7a" />
        <stop offset="40%" stopColor="#e0e0e0" />
        <stop offset="60%" stopColor="#e0e0e0" />
        <stop offset="100%" stopColor="#525252" />
      </linearGradient>
    </defs>
    <polygon points="11,15 13,15 12,23" fill="url(#metal)" />
    <rect x="10.25" y="13.5" width="3.5" height="2" rx="0.5" fill="url(#metal)" />
    <circle cx="12" cy="7.5" r="6.5" fill="url(#redGloss)" />
    <ellipse cx="9.5" cy="5" rx="2" ry="1.5" fill="white" opacity="0.6" transform="rotate(-30 9.5 5)" />
  </svg>
);

export default function Footer() {
  return (
    // NOTE: overflow-hidden removed here — it was hard-clipping the
    // big "Chop n' chop" wordmark's descenders before the orange bar
    // ever got a chance to cover them. The orange bar (z-20) sitting
    // in normal flow after this content now handles the "tuck behind"
    // effect naturally, exactly like the Figma layering.
    <footer className="relative bg-[#FFF7F5] dark:bg-gray-950 pt-8 md:pt-12">

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-20">
        <div className="relative z-10 grid grid-cols-1 gap-12 pb-[180px] sm:grid-cols-2 sm:gap-10 lg:grid-cols-[2.3fr_1fr_1.3fr_1fr] lg:gap-8 lg:pb-[220px] xl:pb-[230px]">

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-full lg:max-w-[340px]">
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
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[14px] font-medium sm:text-[15px]">
              <PinIcon size={22} className="drop-shadow-sm" />
              <span className="text-[#FC6B31] mt-0.5">Lagos, Nigeria</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Explore
            </h4>
            <nav className="flex flex-col items-center lg:items-start gap-2.5 text-[15px] text-[#555F66] sm:gap-3 md:text-[16px]">
              <Link href="#how-it-works" className="hover:text-[#FC6B31] transition-colors">How It Works</Link>
              <Link href="#todays-drop" className="hover:text-[#FC6B31] transition-colors">Today&apos;s Drop</Link>
              <Link href="#faqs" className="hover:text-[#FC6B31] transition-colors">FAQs</Link>
              <Link href="#contact-us" className="hover:text-[#FC6B31] transition-colors">Contact Us</Link>
            </nav>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Contact
            </h4>
            <div className="flex flex-col items-center lg:items-start gap-3 text-[15px] text-[#555F66] sm:gap-3.5 md:gap-4 md:text-[16px]">
              <p>+234 817 202 8728</p>
              <p>+234 703 281 9318</p>
              <p className="break-words">chopnchop.system@gmail.com</p>
              <p className="leading-relaxed">
                Monday – Saturday<br />8:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="mb-3 text-[17px] font-bold text-[#3E3D42] sm:mb-4 md:mb-5 md:text-[18px]">
              Follow Us
            </h4>
            <div className="mb-3 flex justify-center lg:justify-start gap-4 text-[#555F66] md:mb-4">
              <Link href="https://www.instagram.com/chopnchop_ng" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC6B31] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </Link>
              <Link href="https://twitter.com/chopnchop_ng" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC6B31] transition-colors" aria-label="X (Twitter)">
                <XIcon />
              </Link>
              <Link href="https://www.tiktok.com/@chopnchop_ng" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC6B31] transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </Link>
            </div>
            <p className="text-[15px] text-[#555F66] md:text-[16px]">
              @chopnchop_ng
            </p>
          </div>

        </div>

        {/*
          Wordmark rendered as inline SVG instead of CSS background-clip:text.

          Why: background-clip:text has a known Firefox rendering bug where
          curved strokes (like the inside of the p's bowl) get sliced or
          dropped when combined with large font sizes and negative
          letter-spacing — no amount of rearranging transforms fixes that,
          because it's a rasterization bug in how Firefox composites the
          clipped gradient layer, not a stacking-order issue.

          SVG text with a gradient fill paints natively, per-glyph, with no
          clip-then-composite step, so the curves render completely.

          It also removes the line-height guesswork: Figma's box is
          1103x242 at font-size 200 (a ~1.21 ratio — the font's normal
          line-height, not a tight 1:1 as previously assumed). Using that
          exact box as the SVG viewBox means positioning is driven by real
          numbers instead of a percentage of a miscalculated height, which
          is what caused the wordmark to overshoot past the footer.
        */}
    <div
      className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 select-none"
      style={{ bottom: "clamp(-26px, -2vw, -18px)" }}
    >
          <svg
            viewBox="0 0 1103 242"
            className="block w-[90vw] max-w-[1103px] opacity-95"
            style={{
              display: "block",
              filter: "blur(0.35px)",
            }}
          >
            <defs>
              <linearGradient
                id="chopGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2="242"
              >
                <stop offset="0%" stopColor="#FC6B31" />
                <stop offset="30%" stopColor="#FC6B31" />
                <stop offset="55%" stopColor="#FD8A58" />
                <stop offset="72%" stopColor="#FDBA9E" />
                <stop offset="88%" stopColor="#FFE9DF" />
                <stop offset="100%" stopColor="#FFF7F5" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="190"
              fontWeight="700"
              fontSize="200"
              letterSpacing="-16"
              fill="url(#chopGradient)"
              style={{ fontFamily: 'inherit' }}
            >
              Chop n&apos; chop
            </text>
          </svg>
        </div>
      </div>

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

    </footer>
  );
}