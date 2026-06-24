"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionLink {
  id: string;
  label: string;
}

/**
 * Contextual secondary navigation. Slides in once the user scrolls past the
 * hero, scroll-spies the page sections, smooth-scrolls on click, and slides
 * back out near the top. Sits just beneath the fixed header (height measured
 * at runtime so it works with/without the announcement bar).
 */
export default function SectionNav({ items }: { items: SectionLink[] }) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(items[0]?.id);
  const [topOffset, setTopOffset] = useState(72);

  // Track the fixed header height (so the bar sits just beneath it).
  useEffect(() => {
    const measure = () => {
      const h = (document.querySelector("header") as HTMLElement | null)?.offsetHeight;
      if (h) setTopOffset(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Show once the hero has scrolled out of view; hide near the top. Uses an
  // IntersectionObserver (not the window scroll event) so it works with Lenis.
  useEffect(() => {
    const hero = document.querySelector("main section");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Scroll-spy over the section elements.
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // The section wrappers carry scroll-mt (header clearance) which Lenis also
    // honors, so we only add a small offset for this bar's own height.
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -56 });
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - topOffset - 12, behavior: "smooth" });
    }
    setActive(id);
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={false}
      animate={shown ? { y: 0, opacity: 1 } : { y: -12, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ top: topOffset + 16, pointerEvents: shown ? "auto" : "none" }}
      className="fixed inset-x-0 z-40"
    >
      <div className="mx-auto max-w-site px-gutter">
        <nav
          aria-label="On this page"
          className="rounded-xl bg-cream shadow-soft flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 ease-organic",
                  isActive ? "bg-leaf-600 text-cream" : "text-forest-900/70 hover:bg-forest-700/5 hover:text-forest-900",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
