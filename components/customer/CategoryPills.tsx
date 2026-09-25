"use client";

import React from "react";

export interface CategoryPillOption {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface CategoryPillsProps {
  options: CategoryPillOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string; // e.g., to adjust padding for mobile edges
}

export default function CategoryPills({ options, activeId, onChange, className = "" }: CategoryPillsProps) {
  if (!options || options.length === 0) return null;

  return (
    <div 
      className={`flex overflow-x-auto no-scrollbar gap-3 pb-2 ${className}`}
      role="tablist"
      aria-label="Category filters"
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        
        return (
          <button
            type="button"
            key={option.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={`flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[13px] font-bold shadow-sm transition-colors whitespace-nowrap ${
              isActive
                ? "border-[#FC6B31] bg-[#FC6B31] text-white shadow-orange-500/20"
                : "border-gray-100 bg-white text-gray-700 hover:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300"
            }`}
          >
            {option.icon && (
              <span className="text-[14px]" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}