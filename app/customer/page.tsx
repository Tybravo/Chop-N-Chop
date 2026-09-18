"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";

export default function CustomerWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("chopnchop_session") === "active") {
      router.replace("/customer/home");
    }
  }, [router]);

  const handleBrowse = () => {
    router.push("/customer/home");
  };

  const handleSignUp = () => {
    router.push("/customer/signup");
  };

  const handleLogin = () => {
    router.push("/customer/login");
  };

  return (
    <main
      className="
        relative
        flex
        h-[100dvh]
        w-full
        flex-col
        overflow-hidden
        select-none
        px-6
        pt-7
        pb-5
        text-white
        bg-[#F45A26]
        before:absolute
        before:inset-0
        before:pointer-events-none
        before:bg-[linear-gradient(
          155deg,
          #FF7A43_0%,
          #FC6832_28%,
          #F45A26_58%,
          #D9471D_100%
        )]
        before:opacity-95
      "
    >
      {/* =========================================================
          ATMOSPHERE
      ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[35%]
          z-0
          h-[460px]
          w-[460px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFB16F]/25
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[50%]
          z-0
          h-[280px]
          w-[360px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFD0A0]/20
          blur-[80px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-36
          top-[40%]
          z-0
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#C93616]/25
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-[32%]
          z-0
          h-[340px]
          w-[340px]
          rounded-full
          bg-[#FFB07A]/15
          blur-[100px]
        "
      />

      {/* =========================================================
          TOP CONTENT
      ========================================================== */}

      <section
        className="
          relative
          z-20
          flex
          shrink-0
          flex-col
          items-center
          text-center
        "
      >
        {/* TODAY'S CHOP BADGE */}

        <div
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/35
            bg-white/15
            px-4
            py-1.5
            text-[10px]
            font-extrabold
            uppercase
            tracking-[0.13em]
            text-white
            shadow-[0_8px_25px_rgba(80,20,5,0.12)]
            backdrop-blur-md
          "
        >
          <span className="text-yellow-100" aria-hidden="true">✦</span>
          <span>Today&apos;s Chop Is Open</span>
        </div>

        {/* MAIN HEADLINE */}

        <h1
          className="
            mt-5
            max-w-[350px]
            text-center
            text-[42px]
            font-black
            leading-[0.96]
            tracking-[-0.055em]
            drop-shadow-[0_4px_15px_rgba(110,30,5,0.12)]
            sm:text-5xl
          "
        >
          Your next meal
          <span className="block">
            is already cooking.
          </span>
        </h1>

        {/* SUPPORTING COPY (SUCCINCT) */}

        <p
          className="
            mt-4
            max-w-[335px]
            text-[14px]
            font-medium
            leading-[1.5]
            text-orange-50/90
          "
        >
          Curated meals from trusted local kitchens, delivered fresh on your schedule.
        </p>
      </section>

      {/* =========================================================
          HERO FOOD WITH STEAM ANIMATION
      ========================================================== */}

      <section
        className="
          relative
          z-10
          flex
          min-h-0
          flex-1
          items-center
          justify-center
        "
      >
        {/* Food glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[340px]
            w-[340px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#FFE0BD]/20
            blur-[80px]
          "
        />

        {/* Food ground glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[67%]
            h-[170px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#A93218]/25
            blur-[65px]
          "
        />

        {/* Hero food container with closer, richer steam overlay */}
        <div
          className="
            relative
            h-[390px]
            w-[390px]
            max-w-[108vw]
            sm:h-[430px]
            sm:w-[430px]
          "
        >
          {/* LAYERED STEAM / SMOKE EFFECT */}
          <div className="absolute inset-x-0 top-16 sm:top-20 z-20 flex justify-center items-center pointer-events-none">
            
            {/* Base drifting haze layer */}
            <div className="absolute w-[140px] h-[70px] bg-white/20 blur-[24px] rounded-[100%] animate-haze mix-blend-screen" />
            
            {/* 5 Animated Steam Columns */}
            <div className="flex items-end space-x-1 sm:space-x-2 relative z-10 opacity-90">
              <svg className="w-5 h-16 text-white/55 animate-steam-col-1" viewBox="0 0 24 64" fill="none">
                <path d="M12 60C12 45 6 35 6 24C6 13 18 15 18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="w-7 h-20 text-white/45 animate-steam-col-2" viewBox="0 0 24 64" fill="none">
                <path d="M12 60C12 42 18 32 18 20C18 8 6 10 6 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <svg className="w-6 h-18 text-white/50 animate-steam-col-3" viewBox="0 0 24 64" fill="none">
                <path d="M12 60C12 44 6 34 6 24C6 14 16 12 16 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <svg className="w-5 h-14 text-white/40 animate-steam-col-4" viewBox="0 0 24 64" fill="none">
                <path d="M12 60C12 42 16 32 16 20C16 10 8 8 8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg className="w-7 h-24 text-white/40 animate-steam-col-5" viewBox="0 0 24 64" fill="none">
                <path d="M12 60C12 40 18 30 18 18C18 6 6 8 6 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <Image
            src="/efo-riro.png"
            alt="Fresh Nigerian meal"
            fill
            priority
            sizes="(max-width: 640px) 108vw, 430px"
            className="
              relative
              z-10
              object-contain
              drop-shadow-[0_34px_42px_rgba(65,20,5,0.42)]
            "
          />
        </div>
      </section>

      {/* =========================================================
          ACTION AREA
      ========================================================== */}

      <section
        className="
          relative
          z-20
          mx-auto
          w-full
          max-w-sm
          shrink-0
        "
      >
        <div className="space-y-3">
          {/* PRIMARY — GUEST FIRST */}

          <button
            type="button"
            onClick={handleBrowse}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-full
              bg-white
              text-[15px]
              font-extrabold
              text-[#252525]
              shadow-[0_14px_32px_rgba(90,30,10,0.25)]
              transition-all
              hover:bg-white/95
              active:scale-[0.98]
            "
          >
            <span>Explore today&apos;s meals</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* LOGIN */}

          <button
            type="button"
            onClick={handleLogin}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-full
              border
              border-white/30
              bg-black/15
              text-sm
              font-extrabold
              text-white
              shadow-[0_8px_28px_rgba(70,15,5,0.18)]
              backdrop-blur-md
              transition-all
              hover:bg-black/20
              active:scale-[0.98]
            "
          >
            <LogIn className="h-4 w-4" />
            <span>Log in</span>
          </button>

          {/* SIGN UP */}

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleSignUp}
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-orange-50
                transition-colors
                hover:text-white
              "
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-100" />
              <span>Sign up to earn Crowns</span>
            </button>
          </div>

          {/* BRAND LINE */}

          <p
            className="
              px-3
              pt-1
              text-center
              text-[10px]
              font-semibold
              leading-[1.45]
              tracking-[0.01em]
              text-orange-50/75
            "
          >
            Fresh meals. Smart delivery. No unnecessary waiting.
          </p>

          {/* LEGAL */}

          <p
            className="
              px-3
              pt-0.5
              text-center
              text-[9px]
              font-medium
              leading-[1.45]
              text-orange-50/55
            "
          >
            By continuing, you agree to ChopnChop&apos;s
            Terms &amp; Conditions and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}