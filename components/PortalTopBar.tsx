"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Minimal top bar: Chopnchop logo (left) + Light/Dark theme toggle (right).
 * Used on auth/standalone pages that have no full navbar or dashboard header.
 */
export default function PortalTopBar() {
  return (
    <header className="relative z-50 flex items-center justify-between w-full py-4 px-4 lg:px-[80px] bg-background border-b border-[#E5E7EB] dark:border-secondary-light/20">
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo_icon.png"
            alt="Chop n Chop Icon"
            width={44}
            height={44}
            className="w-7 h-7 md:w-9 md:h-9 object-contain transition-transform group-hover:scale-105"
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

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}