"use client";

import { cn } from "@/lib/utils";

interface FAQSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  id?: string;
  placeholder?: string;
  /** Light variant sits on the dark hero. */
  variant?: "light" | "default";
  className?: string;
}

/** Accessible FAQ search input (presentational). */
export default function FAQSearch({
  value,
  onChange,
  resultCount,
  id = "faq-search",
  placeholder = "Search questions…",
  variant = "default",
  className,
}: FAQSearchProps) {
  const light = variant === "light";
  return (
    <div className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search frequently asked questions
      </label>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2",
          light ? "text-cream/70" : "text-bark-700/50",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-describedby={`${id}-count`}
        className={cn(
          "w-full rounded-full py-3.5 pl-12 pr-4 text-base outline-none transition-colors",
          light
            ? "border border-cream/30 bg-cream/10 text-cream placeholder:text-cream/60 backdrop-blur focus-visible:border-cream/60 focus-visible:bg-cream/15"
            : "border border-forest-700/15 bg-white text-forest-900 shadow-soft placeholder:text-bark-700/40 focus-visible:border-leaf-600 focus-visible:ring-2 focus-visible:ring-leaf-600/40",
        )}
      />
      {typeof resultCount === "number" && (
        <span id={`${id}-count`} role="status" className="sr-only">
          {resultCount} {resultCount === 1 ? "result" : "results"} found
        </span>
      )}
    </div>
  );
}
