"use client";

import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function DownloadFloatingButton() {
  const { isInstallable, promptInstall } = usePwaInstall();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };
    checkStandalone();
  }, []);

  if (!isInstallable || isStandalone) return null;

  return (
    // Mobile-only floating button; desktop users get the navbar InstallPwaButton
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <button
        onClick={promptInstall}
        className="group relative flex items-center gap-4 bg-[#FC6B31] text-white p-1.5 pr-6 rounded-full font-extrabold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden"
        aria-label="Install ChopnChop app"
      >
        {/* Animated Icon Container (Mimics the white circle in your reference) */}
        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 relative overflow-hidden shadow-sm">
          {/* Arrow that slides down and out on hover */}
          <ArrowDown
            strokeWidth={3}
            className="w-5 h-5 text-[#FC6B31] absolute transition-transform duration-500 ease-in-out group-hover:translate-y-[150%]"
          />
          {/* Arrow that slides in from the top on hover */}
          <ArrowDown
            strokeWidth={3}
            className="w-5 h-5 text-[#FC6B31] absolute -translate-y-[150%] transition-transform duration-500 ease-in-out group-hover:translate-y-0"
          />
        </div>

        {/* Text Area */}
        <span className="tracking-widest text-[14px] uppercase pt-0.5">
          Download
        </span>

      </button>
    </div>
  );
}