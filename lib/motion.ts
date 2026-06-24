/**
 * Motion design tokens — the single source of truth for the GSAP/Lenis
 * motion system (BLUEPRINT §13). Components import these instead of
 * hardcoding durations/eases so the whole site moves with one voice:
 * "natural motion" — things grow, sway, and settle; nothing snaps.
 */

export const duration = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
} as const;

/** GSAP easing strings. `grow` adds a gentle, child-joy overshoot — use sparingly. */
export const ease = {
  standard: "power2.out",
  entrance: "power3.out",
  grow: "back.out(1.4)",
  inOut: "power2.inOut",
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.08,
  loose: 0.1,
} as const;

/** Lenis smooth-scroll configuration (tuned lower on touch for control). */
export const lenisOptions = {
  duration: 1.1,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
} as const;

/** True when the user has asked the OS to minimize motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Framer Motion variants ──────────────────────────────────────
 * The component/page-level motion language (the default engine per the
 * approved architecture). Cubic-bezier mirrors the `organic` Tailwind ease.
 * Reveal primitives in components/motion/* consume these.
 */
import type { Variants, Transition } from "framer-motion";

export const easeOrganic = [0.16, 1, 0.3, 1] as const;

const baseTransition: Transition = { duration: duration.base, ease: easeOrganic };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: baseTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: baseTransition },
};

/** Container that cascades its `staggerItem` children on view. */
export const staggerContainer = (stagger: number = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
});

export const staggerItem: Variants = fadeUp;

/** Shared whileInView viewport config — fire once, a little before fully visible. */
export const inViewport = { once: true, amount: 0.25 } as const;
