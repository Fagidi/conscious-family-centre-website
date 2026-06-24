"use client";

import type { FaqCategoryDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FAQCategoryTabsProps {
  categories: FaqCategoryDoc[];
  active: string; // "all" or a category slug
  counts: Record<string, number>;
  onChange: (value: string) => void;
}

/** Category filter chips (tabs). Hides empty categories to avoid dead ends. */
export default function FAQCategoryTabs({ categories, active, counts, onChange }: FAQCategoryTabsProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const options = [
    { slug: "all", title: "All", count: total },
    ...categories
      .map((c) => ({ slug: c.slug, title: c.title, count: counts[c.slug] ?? 0 }))
      .filter((c) => c.count > 0),
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter questions by topic">
      {options.map((opt) => {
        const isActive = active === opt.slug;
        return (
          <button
            key={opt.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.slug)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-organic",
              isActive ? "bg-leaf-600 text-cream" : "bg-white text-forest-900/70 shadow-soft hover:text-forest-900",
            )}
          >
            {opt.title}
            <span className={cn("ml-1.5 text-xs", isActive ? "text-cream/70" : "text-bark-700/40")}>{opt.count}</span>
          </button>
        );
      })}
    </div>
  );
}
