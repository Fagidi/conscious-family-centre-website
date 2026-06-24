"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { lenisOptions } from "@/lib/motion";

/**
 * Lenis smooth scrolling on its own rAF loop (no global GSAP — per the
 * approved motion strategy: Framer Motion + Lenis are the default engine).
 * Lenis updates native scroll position, so Framer's `whileInView`/`useScroll`
 * work unchanged. Disabled for users who prefer reduced motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis(lenisOptions);
    // Expose the instance so same-page anchor scrolling (e.g. SectionNav) can
    // go through Lenis instead of fighting it with window.scrollTo.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
