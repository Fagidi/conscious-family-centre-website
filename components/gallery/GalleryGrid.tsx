"use client";

import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface GalleryGridProps {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}

const aspects = ["aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]"];

/**
 * Masonry tile grid (CSS columns) with hover zoom and a caption overlay.
 * Each tile opens the lightbox. Staggered reveal replays when the parent
 * remounts it (keyed by the active filter/search) for smooth transitions.
 */
export default function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <Stagger className="gap-3 [column-gap:0.75rem] sm:columns-2 lg:columns-3" gap={0.04}>
      {items.map((item, i) => {
        const label = item.title || item.caption || item.image.alt || "gallery image";
        return (
          <StaggerItem key={item.slug || item.image.src + i} className="mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => onOpen(i)}
              aria-label={`Open image: ${label}`}
              className="group relative block w-full overflow-hidden rounded-card outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span className={cn("relative block", aspects[i % aspects.length])}>
                <SmartImage
                  image={item.image}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                {(item.title || item.caption) && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-medium text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {item.title || item.caption}
                  </span>
                )}
              </span>
            </button>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
