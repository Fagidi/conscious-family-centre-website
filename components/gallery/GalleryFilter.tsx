"use client";

import type { GalleryCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GalleryFilterProps {
  categories: GalleryCategory[];
  active: string; // "all" or a category slug
  onChange: (value: string) => void;
}

/** Category filter chips (presentational). "All" plus each gallery category. */
export default function GalleryFilter({ categories, active, onChange }: GalleryFilterProps) {
  if (categories.length === 0) return null;
  const options = [{ slug: "all", title: "All" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery by category">
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
              isActive
                ? "bg-leaf-600 text-cream"
                : "bg-white text-forest-900/70 shadow-soft hover:text-forest-900",
            )}
          >
            {opt.title}
          </button>
        );
      })}
    </div>
  );
}
