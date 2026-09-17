"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const suggestions = ["Jollof", "Pizza", "Smoothies"];

export default function HomeSearchPrompt() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const navigateToExplore = (value: string) => {
    const searchParams = new URLSearchParams();
    if (value.trim()) searchParams.set("q", value.trim());
    router.push(`/customer/explore${searchParams.size ? `?${searchParams.toString()}` : ""}`);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToExplore(query);
  };

  return (
    <section className="w-full" aria-labelledby="home-search-title">
      <h2 id="home-search-title" className="sr-only">
        Search meals and vendors
      </h2>

      <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-[18px] border border-gray-100 bg-white px-4 py-2 shadow-sm focus-within:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900">
        <Sparkles className="h-5 w-5 shrink-0 text-[#FC6B31]" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask AI for a lunch recommendation..."
          aria-label="Search meals or vendors with AI"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        />
        <button
          type="submit"
          className="flex h-10 min-w-[88px] items-center justify-center gap-1.5 rounded-full bg-[#FC6B31] px-3 text-[13px] font-bold text-white transition-colors hover:bg-[#e95d27] active:scale-[0.98]"
        >
          Ask AI
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 pr-1 text-[11px] font-semibold text-gray-400">
          <Sparkles className="h-3.5 w-3.5 text-[#FC6B31]" aria-hidden="true" />
          AI Suggests:
        </span>
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            onClick={() => navigateToExplore(suggestion)}
            className="min-h-[32px] rounded-full border border-gray-100 bg-gray-50 px-3 text-[11px] font-semibold text-gray-600 transition-colors hover:border-[#FC6B31] hover:text-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
