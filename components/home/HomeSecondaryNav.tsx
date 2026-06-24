"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionLink {
  id: string;
  label: string;
}

/**
 * Homepage-specific floating content navigator. DESKTOP ONLY.
 *
 * Positioned in the lower portion of the viewport (like a sticky footer).
 * Appears once user enters homepage content (scrolls past hero).
 * Remains sticky and visible while content scrolls behind it.
 * Disappears when returning to top.
 *
 * Uses IntersectionObserver to detect when hero is out of view.
 * Scroll-spy to highlight current section.
 *
 * Mobile: Hidden completely.
 */
export default function HomeSecondaryNav({ items }: { items: SectionLink[] }) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(items[0]?.id);

  // Show once the hero has scrolled out of view; hide near the top.
  // Uses IntersectionObserver (not scroll event) for Lenis compatibility.
  useEffect(() => {
    const hero = document.querySelector("main > section");
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
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -56 });
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
    }
    setActive(id);
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={false}
      animate={shown ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none hidden lg:block"
    >
      <div className="mx-auto max-w-site px-gutter pb-8">
        <nav
          aria-label="Content sections"
          className="pointer-events-auto rounded-2xl bg-cream shadow-lg flex justify-center gap-4 overflow-x-auto px-8 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-organic",
                  isActive
                    ? "bg-leaf-600 text-cream shadow-md"
                    : "text-forest-900/70 hover:bg-forest-700/8 hover:text-forest-900",
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
