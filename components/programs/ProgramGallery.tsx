"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem, ProgramsPageContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import SmartImage from "@/components/ui/SmartImage";

interface ProgramGalleryProps {
  content: ProgramsPageContent["gallery"];
  items: GalleryItem[];
}

const aspects = ["aspect-[3/4]", "aspect-square", "aspect-[4/3]"];

/**
 * Program Gallery — filterable masonry with an accessible lightbox. Filters are
 * derived from each item's program (falling back to "All" when none are set).
 */
export default function ProgramGallery({ content, items }: ProgramGalleryProps) {
  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filters = useMemo(() => {
    const programs = Array.from(new Set(items.map((i) => i.program).filter(Boolean))) as string[];
    return programs.length > 0 ? ["All", ...programs] : [];
  }, [items]);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.program === filter)),
    [items, filter],
  );

  // Close the lightbox on Escape; lock body scroll while it's open.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((n) => (n === null ? n : (n + 1) % visible.length));
      if (e.key === "ArrowLeft") setLightbox((n) => (n === null ? n : (n - 1 + visible.length) % visible.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, visible.length]);

  if (items.length === 0) return null;
  const current = lightbox === null ? null : visible[lightbox];

  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          {content.eyebrow && <p className="eyebrow mb-3">{content.eyebrow}</p>}
          <h2 className="text-display-md">{content.heading}</h2>
          {content.intro && <p className="mt-4 text-lg leading-relaxed text-bark-700/80">{content.intro}</p>}
        </div>

        {filters.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-organic",
                  filter === f ? "bg-leaf-600 text-cream" : "bg-white text-forest-900/70 shadow-soft hover:text-forest-900",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 gap-3 [column-gap:0.75rem] sm:columns-2 lg:columns-3">
          {visible.map((item, i) => (
            <button
              key={item.image.src + i}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative mb-3 block w-full overflow-hidden rounded-card outline-none break-inside-avoid focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              aria-label={`Open image: ${item.image.alt || item.caption || "gallery image"}`}
            >
              <span className={cn("relative block", aspects[i % aspects.length])}>
                <SmartImage
                  image={item.image}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
                />
              </span>
            </button>
          ))}
        </div>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-900/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20"
              aria-label="Close image viewer"
              autoFocus
            >
              ✕
            </button>
            <motion.figure
              className="relative max-h-[85vh] w-full max-w-4xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card-lg">
                <SmartImage image={current.image} fill sizes="100vw" className="object-contain" />
              </div>
              {current.caption && (
                <figcaption className="mt-3 text-center text-sm text-cream/80">{current.caption}</figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
