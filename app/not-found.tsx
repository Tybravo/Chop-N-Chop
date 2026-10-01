import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-background px-4 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#26292C] border border-gray-200 dark:border-gray-800 shadow-[0_10px_28px_-14px_rgba(252,107,49,0.85)] flex items-center justify-center">
              <Image
                src="/logo_icon.png"
                alt="Chopnchop"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Chop<span className="text-primary">n{"'"}</span>Chop
            </span>
          </Link>
        </div>

        {/* 404 Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-primary rounded-full border border-orange-100 dark:border-orange-800/30">
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-sm font-semibold">Error 404</span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          4<span className="text-primary">0</span>4
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          This page could not be found
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-md leading-relaxed">
          Looks like this dish is off the menu! The page you{"'"}re looking for
          was moved, renamed, or never made it to the kitchen.
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-semibold shadow-[0_10px_28px_-14px_rgba(252,107,49,0.85)] transition-all duration-200 hover:shadow-[0_14px_35px_-14px_rgba(252,107,49,0.95)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>

        <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
          Fresh meals, delivered on time — back to the landing page.
        </p>
      </div>
    </div>
  );
}