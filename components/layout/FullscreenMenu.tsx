"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { primaryMenuItems, submenusBySection } from "@/lib/megaMenu";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

interface FullscreenMenuProps {
  siteName: string;
  open: boolean;
  onClose: () => void;
}

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemV = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const submenuV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

/**
 * Fullscreen editorial mega menu (TAS-inspired). Two-column layout on desktop:
 * left column shows primary navigation items, right column shows contextual
 * submenu based on active item. Mobile shows single column with focus on primary items.
 */
export default function FullscreenMenu({ siteName, open, onClose }: FullscreenMenuProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setActive(0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeItem = primaryMenuItems[active];
  const submenu = submenusBySection[activeItem?.title] || [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[60] overflow-y-auto bg-cream"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-gutter py-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-12">
              <Link href="/" onClick={onClose} className="font-display text-xl font-semibold text-forest-900">
                {siteName}
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex items-center gap-2 text-sm font-medium text-forest-900 hover:text-leaf-600 transition-colors"
              >
                <span className="hidden sm:inline">Close</span>
                <span aria-hidden className="text-2xl leading-none">✕</span>
              </button>
            </div>

            {/* Body: two-column layout on desktop */}
            <div className="flex-1 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
              {/* Left column: primary navigation items */}
              <motion.nav aria-label="Primary" variants={listV} initial="hidden" animate="show" className="flex flex-col">
                {primaryMenuItems.map((item, i) => (
                  <motion.div key={item.href} variants={itemV}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group relative py-6 border-b border-forest-700/10 transition-colors hover:text-leaf-600"
                    >
                      <div className="flex items-start gap-6">
                        {/* Mobile thumbnail */}
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg lg:hidden flex-shrink-0">
                          <SmartImage image={item.image} fill sizes="80px" className="object-cover" />
                        </div>

                        {/* Title and description */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-forest-900 group-hover:text-leaf-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-base text-bark-700/70 leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <span aria-hidden className="hidden lg:block text-leaf-600 text-xl opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 mt-2 flex-shrink-0">
                          →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Right column: contextual submenu (desktop only) */}
              <motion.div
                key={activeItem?.title}
                variants={submenuV}
                initial="hidden"
                animate="show"
                className="hidden lg:flex flex-col"
              >
                {submenu.length > 0 && (
                  <div className="sticky top-0">
                    <p className="text-sm font-semibold text-forest-900/60 uppercase tracking-wide mb-6">
                      Explore {activeItem?.title}
                    </p>
                    <nav className="space-y-3">
                      {submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          onClick={onClose}
                          className="block text-lg text-forest-900 hover:text-leaf-600 transition-colors py-2 border-l-2 border-transparent hover:border-leaf-600 pl-3"
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Footer CTAs */}
            <div className="mt-12 border-t border-forest-700/10 pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <Button href="/contact" onClick={onClose}>
                  Book a Visit
                </Button>
                <Button href="/camp-registration" variant="secondary" onClick={onClose}>
                  Summer Camp Registration
                </Button>
              </div>
              <p className="text-sm text-bark-700/70">
                Wuse 2, Abuja · <span className="text-forest-900 font-medium">Mon–Sat 10:00–15:00</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
