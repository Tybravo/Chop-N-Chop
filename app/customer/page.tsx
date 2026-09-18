"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Truck, Sparkles } from "lucide-react";

export default function CustomerWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("chopnchop_session") === "active") {
      router.replace("/customer/home");
    }
  }, [router]);

  const handleSignUp = () => {
    router.push("/customer/signup");
  };

  const handleLogin = () => {
    router.push("/customer/login");
  };

  const handleGuestBrowsing = () => {
    router.push("/customer/home");
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

        bg-[radial-gradient(
          ellipse_at_50%_42%,
          rgba(255,190,125,0.52)_0%,
          rgba(255,135,70,0.32)_20%,
          transparent_46%
        )]

        before:absolute
        before:inset-0
        before:pointer-events-none

        before:bg-[linear-gradient(
          160deg,
          #FF7A43_0%,
          #FC6832_28%,
          #F45A26_58%,
          #D9471D_100%
        )]

        before:opacity-90
      "
    >

      {/* =========================================================
          HOT / SMOKY ATMOSPHERE
      ========================================================== */}

      {/* Large warm glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[38%]
          z-0
          h-[430px]
          w-[430px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFB16F]/25
          blur-[100px]
        "
      />

      {/* Hot center glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[47%]
          z-0
          h-[260px]
          w-[340px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFD0A0]/20
          blur-[70px]
        "
      />

      {/* Smoky left atmosphere */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-[32%]
          z-0
          h-[330px]
          w-[330px]
          rounded-full
          bg-[#FFB07A]/15
          blur-[100px]
        "
      />

      {/* Smoky right atmosphere */}
      <div
        className="
          pointer-events-none
          absolute
          -right-36
          top-[42%]
          z-0
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#C93616]/25
          blur-[110px]
        "
      />

      {/* Bottom roasted glow */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          left-1/2
          z-0
          h-[420px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#A93218]/25
          blur-[110px]
        "
      />

      {/* =========================================================
          TOP
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

        {/* Earn Crowns */}
        <button
          type="button"
          onClick={handleSignUp}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/40
            bg-white/15
            px-4
            py-1.5
            text-[11px]
            font-extrabold
            uppercase
            tracking-[0.08em]
            text-white
            shadow-[0_8px_25px_rgba(80,20,5,0.12)]
            backdrop-blur-md
            transition-all
            active:scale-95
          "
        >
          <Sparkles className="h-3.5 w-3.5 text-yellow-100" />

          <span>
            Earn Crowns · Join Now
          </span>
        </button>

        {/* Heading */}
        <h1
          className="
            mt-5
            max-w-[320px]
            text-center
            text-[42px]
            font-black
            leading-[0.96]
            tracking-[-0.05em]
            drop-shadow-[0_4px_15px_rgba(110,30,5,0.12)]
            sm:text-5xl
          "
        >
          Welcome to
          <span className="block">
            ChopnChop
          </span>
        </h1>

      </section>


      {/* =========================================================
          HERO FOOD
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

        {/* Food halo */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[330px]
            w-[330px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#FFE0BD]/20
            blur-[75px]
          "
        />

        {/* Ground heat */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[62%]
            h-[180px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#B93817]/25
            blur-[65px]
          "
        />

        {/* FOOD */}
        <div
          className="
            relative
            h-[370px]
            w-[370px]
            max-w-[108vw]
            sm:h-[410px]
            sm:w-[410px]
          "
        >
          <Image
            src="/efo-riro.png"
            alt="Efo Riro and pounded yam"
            fill
            priority
            sizes="(max-width: 640px) 108vw, 410px"
            className="
              relative
              z-10
              object-contain
              drop-shadow-[0_32px_40px_rgba(65,20,5,0.42)]
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

          {/* SIGN UP */}
          <button
            type="button"
            onClick={handleSignUp}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-3
              rounded-full
              bg-white
              text-sm
              font-extrabold
              text-[#252525]
              shadow-[0_14px_32px_rgba(90,30,10,0.25)]
              transition-all
              hover:bg-white/95
              active:scale-[0.98]
            "
          >
            <Mail className="h-4 w-4 text-[#555]" />

            <span>
              Continue with Email
            </span>
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
              gap-3
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
            <Truck className="h-4 w-4 text-orange-100" />

            <span>
              Log in / Order Delivery
            </span>
          </button>


          {/* GUEST */}
          <div className="pt-0.5 text-center">
            <button
              type="button"
              onClick={handleGuestBrowsing}
              className="
                text-xs
                font-bold
                text-orange-50
                underline
                underline-offset-4
                decoration-white/50
                transition-colors
                hover:text-white
              "
            >
              Or browse as guest
            </button>
          </div>


          {/* LEGAL */}
          <p
            className="
              px-3
              pt-1
              text-center
              text-[9px]
              font-medium
              leading-[1.45]
              text-orange-50/75
            "
          >
            By tapping Continue with Email or Log in, you agree to
            ChopnChop&apos;s Terms & Conditions and Privacy Policy.
          </p>

        </div>

      </section>

    </main>
  );
}