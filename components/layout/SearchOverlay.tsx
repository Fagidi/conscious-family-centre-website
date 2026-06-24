"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Destination {
  label: string;
  href: string;
  hint: string;
}

// Quick-find over the site's real destinations (no external search backend).
const DESTINATIONS: Destination[] = [
  { label: "Home", href: "/", hint: "Welcome" },
  { label: "About Us", href: "/about", hint: "Our story & philosophy" },
  { label: "Our Story", href: "/about#our-story", hint: "About" },
  { label: "Mission & Vision", href: "/about#mission", hint: "About" },
  { label: "Our Environment", href: "/about#environment", hint: "About" },
  { label: "Meet the Team", href: "/about#team", hint: "About" },
  { label: "Programs", href: "/programs", hint: "All programs" },
  { label: "Stay & Play", href: "/programs/stay-and-play", hint: "Program" },
  { label: "Forest School", href: "/programs/forest-school", hint: "Program" },
  { label: "Homeschool Hub", href: "/programs/homeschool-hub", hint: "Program" },
  { label: "Creative Arts", href: "/programs/creative-arts", hint: "Program" },
  { label: "Gallery", href: "/gallery", hint: "Photos" },
  { label: "FAQ", href: "/faq", hint: "Answers" },
  { label: "Contact", href: "/contact", hint: "Get in touch" },
  { label: "Summer Camp Registration", href: "/camp-registration", hint: "Future Makers 2026" },
];

/** Lightweight site search overlay — filters destinations live; Enter opens the top match. */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter((d) => `${d.label} ${d.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-forest-900/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={onClose}
        >
          <div className="mx-auto max-w-2xl px-gutter pt-28 pb-16" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) go(results[0].href);
              }}
            >
              <label htmlFor="site-search" className="sr-only">Search the site</label>
              <input
                id="site-search"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages…"
                className="w-full border-b-2 border-cream/30 bg-transparent pb-4 font-display text-3xl text-cream placeholder:text-cream/40 focus-visible:border-sun-400 focus-visible:outline-none md:text-4xl"
              />
            </form>

            <ul className="mt-8 space-y-1" role="listbox" aria-label="Results">
              {results.map((d) => (
                <li key={d.href}>
                  <button
                    type="button"
                    onClick={() => go(d.href)}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-4 rounded-card px-4 py-3 text-left transition-colors hover:bg-cream/10",
                    )}
                  >
                    <span className="text-lg font-medium text-cream">{d.label}</span>
                    <span className="text-sm text-cream/50">{d.hint}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="px-4 py-6 text-cream/60">No matches — try another term.</li>}
            </ul>

            <button type="button" onClick={onClose} className="mt-8 text-sm text-cream/60 hover:text-cream">
              Close (Esc)
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
