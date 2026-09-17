"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Droplets, Sparkles } from "lucide-react";

export default function CustomerWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("chopnchop_session") === "active") {
      router.replace("/customer/home");
    }
  }, [router]);

  // Specific routing handlers
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
    <main className="h-[100dvh] w-full overflow-hidden bg-white flex flex-col text-gray-900 select-none">
      <section className="relative h-[58dvh] min-h-[320px] max-h-[520px] md:h-[60vh] md:min-h-[420px] md:max-h-[620px] overflow-hidden bg-[#FC6B31]">
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-8 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 left-8 w-24 h-24 rounded-full border-[1.5px] border-white/15" />
        <div className="absolute top-24 right-10 w-3 h-3 rounded-full bg-white/40" />
        <div className="absolute bottom-24 right-24 w-2 h-2 rounded-full bg-white/50" />

        <h1 className="absolute top-[max(1.25rem,env(safe-area-inset-top))] left-6 right-16 z-20 text-white text-[32px] leading-[0.96] font-extrabold tracking-[-0.04em]">
          Food That Feels
          <br />
          Just Right...
        </h1>

        <svg
          className="absolute inset-0 z-10 h-full w-full pointer-events-none"
          viewBox="0 0 390 520"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M72 148 C104 178 128 205 164 238"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M318 374 C288 342 258 315 224 286"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>

        <div className="absolute top-[27%] left-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1.5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
          <span className="text-[10px] font-semibold text-white">Vitamin B3</span>
        </div>

        <div className="absolute bottom-[20%] right-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1.5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <Droplets className="h-3.5 w-3.5 text-white" />
          <span className="text-[10px] font-semibold text-white">Minerals</span>
        </div>

        <div className="absolute inset-x-0 top-[23%] bottom-[16%] z-10 flex items-center justify-center px-8">
          <div className="relative h-full w-full max-w-[320px]">
            <div className="absolute inset-6 rounded-full bg-white/15 blur-2xl" />
            <Image
              src="/hero-food-illustration.png"
              alt="ChopnChop meal illustration"
              fill
              className="relative z-10 object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.28)]"
            />
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-[92px] md:h-[120px]"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,160 L0,0 C220,132 460,160 720,160 C980,160 1220,132 1440,0 L1440,160 Z"
            fill="#ffffff"
          />
        </svg>
      </section>

      <section className="relative z-20 flex-1 min-h-0 bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col justify-center">
        <div className="text-center">
          <h2 className="text-[24px] font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-relaxed text-gray-500">
            Good to see you again. Continue your journey with delicious meals
            delivered straight to you.
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          {/* Sign Up Button -> Routes to /customer/signup */}
          <button
            type="button"
            onClick={handleSignUp}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FC6B31] text-white text-[14px] font-bold shadow-lg shadow-orange-500/20 transition-all hover:bg-[#e95d27] active:scale-[0.98]"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Log In Button -> Routes to /customer/login */}
          <button
            type="button"
            onClick={handleLogin}
            className="flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white text-[14px] font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            Log in
          </button>

          {/* Guest Browsing Button -> Routes directly to home */}
          <button
            type="button"
            onClick={handleGuestBrowsing}
            className="flex h-11 w-full items-center justify-center rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            Browse as Guest
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          New here?{" "}
          <button
            type="button"
            onClick={handleSignUp}
            className="text-[#FC6B31] font-bold hover:underline"
          >
            Create an account
          </button>
        </p>
      </section>
    </main>
  );
}