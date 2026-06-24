"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
}

/**
 * Sticky program selector with scroll-spy. Clicking smooth-scrolls to the
 * matching feature block; an IntersectionObserver tracks the active section.
 * The bar scrolls horizontally on small screens.
 */
export default function ProgramNavigation({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Bias the active band toward the upper third, below the sticky bar.
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Programs"
      className="sticky top-16 z-30 border-y border-forest-700/10 bg-cream/90 backdrop-blur md:top-20"
    >
      <div className="mx-auto flex max-w-content gap-2 overflow-x-auto px-gutter py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-organic",
                isActive
                  ? "bg-leaf-600 text-cream"
                  : "text-forest-900/70 hover:bg-forest-700/5 hover:text-forest-900",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
