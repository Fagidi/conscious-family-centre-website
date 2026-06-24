"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteSettings } from "@/lib/types";

/**
 * Dismissible top banner — CMS-driven (siteSettings.announcement).
 * Supports Summer Camp / Open Enrolments / Community Events messaging via
 * the editable text + CTA + link + active fields.
 */
export default function AnnouncementBanner({ announcement }: { announcement: SiteSettings["announcement"] }) {
  const [open, setOpen] = useState(true);
  if (!announcement?.active) return null;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden bg-forest-900 text-cream"
        >
          <div className="relative mx-auto flex max-w-site items-center justify-center gap-3 px-gutter py-2.5 text-sm">
            <p className="text-center">
              <span className="font-medium">{announcement.text}</span>
              {announcement.link && announcement.ctaLabel && (
                <Link
                  href={announcement.link}
                  className="ml-3 inline-flex items-center gap-1 font-semibold text-sun-400 underline-offset-4 hover:underline"
                >
                  {announcement.ctaLabel} <span aria-hidden>→</span>
                </Link>
              )}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss announcement"
              className="absolute right-gutter top-1/2 -translate-y-1/2 text-cream/70 transition-colors hover:text-cream"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
