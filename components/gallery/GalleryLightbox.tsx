"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import Tag from "@/components/ui/Tag";

interface GalleryLightboxProps {
  item: GalleryItem | null;
  hasNav: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Accessible image lightbox. Shows a larger view plus caption, category and an
 * optional story. Keyboard handling (Esc / arrows) lives in the orchestrator;
 * here we provide visible, focusable controls and a labelled dialog.
 */
export default function GalleryLightbox({ item, hasNav, onClose, onPrev, onNext }: GalleryLightboxProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-900/92 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title || item.caption || "Image viewer"}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
            aria-label="Close image viewer"
            autoFocus
          >
            ✕
          </button>

          {hasNav && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <motion.figure
            className="flex max-h-[88vh] w-full max-w-5xl flex-col"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card-lg">
              <SmartImage image={item.image} fill sizes="100vw" className="object-contain" priority />
            </div>
            <figcaption className="mt-4 text-center text-cream">
              {item.category && (
                <div className="mb-2 flex justify-center">
                  <Tag tone="sun">{item.category.title}</Tag>
                </div>
              )}
              {(item.title || item.caption) && (
                <p className="font-display text-xl text-cream">{item.title || item.caption}</p>
              )}
              {item.description && (
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-cream/75">{item.description}</p>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
