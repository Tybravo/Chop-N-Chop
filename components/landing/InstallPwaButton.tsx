"use client";

import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function InstallPwaButton() {
  const { isInstallable, promptInstall } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={promptInstall}
      className="bg-[#FF6633]/10 border border-[#FF6633]/30 text-[#FF6633] px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#FF6633]/20 transition-colors"
      aria-label="Install ChopnChop app"
    >
      <Download size={16} />
      Install App
    </button>
  );
}
