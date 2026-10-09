"use client";

import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface InstallPwaButtonProps {
  className?: string;
}

export default function InstallPwaButton({ className }: InstallPwaButtonProps) {
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
    <button
      onClick={promptInstall}
      className={`bg-[#FF6633]/10 border border-[#FF6633]/30 text-[#FF6633] px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#FF6633]/20 transition-colors ${className}`}
      aria-label="Install ChopnChop app"
    >
      <Download size={16} />
      Install App
    </button>
  );
}
