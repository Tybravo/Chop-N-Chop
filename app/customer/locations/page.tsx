"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";
import axios from "axios";

interface Hub {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  status?: string;
  openingTime?: { hour?: number; minute?: number } | string;
  closingTime?: { hour?: number; minute?: number } | string;
}

function fmtTime(t?: Hub["openingTime"]) {
  if (!t) return "";
  if (typeof t === "string") return t;
  const h = t.hour ?? 0, m = t.minute ?? 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function LocationsPage() {
  const router = useRouter();
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHubs = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await customerApiClient.get("/api/v1/hubs/active");
        const data = res.data?.data || res.data || [];
        setHubs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          setError("Log in to view available hubs.");
        } else {
          setError("Unable to load hubs right now.");
        }
        setHubs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHubs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
        <button type="button" onClick={() => router.back()} aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Saved Hubs & Locations</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-3xl">
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div role="status" className="flex items-center justify-center rounded-[24px] border border-gray-100 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900">
              <Loader2 className="h-6 w-6 animate-spin text-[#FC6B31]" />
            </div>
          ) : error ? (
            <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <MapPin className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Couldn&apos;t load hubs</h3>
              <p className="mt-1 text-[13px] text-gray-500">{error}</p>
              {error.includes("Log in") && (
                <button type="button" onClick={() => router.push("/customer/login")} className="mt-4 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white">Log in</button>
              )}
            </div>
          ) : hubs.length === 0 ? (
            <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <MapPin className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">No active hubs</h3>
              <p className="mt-1 text-[13px] text-gray-500">Available pickup hubs will appear here when they&apos;re live.</p>
            </div>
          ) : (
            hubs.map((hub) => (
              <article key={hub.id} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FC6B31]/10 text-[#FC6B31]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white">{hub.name || "Hub"}</h4>
                      {hub.status && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:bg-emerald-950/30">{hub.status}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
                      {[hub.address, hub.city, hub.state].filter(Boolean).join(", ") || "Address unavailable"}
                    </p>
                    {(hub.openingTime || hub.closingTime) && (
                      <p className="mt-2 text-[12px] font-medium text-gray-500 dark:text-gray-400">
                        Hours: {fmtTime(hub.openingTime)} – {fmtTime(hub.closingTime)}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
