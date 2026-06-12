"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Entrance offset in px */
  y?: number;
  delay?: number;
  duration?: number;
  /** Stagger direct children instead of animating the wrapper as one block */
  stagger?: number;
}

/**
 * Scroll-triggered fade-and-rise reveal — the house entrance for
 * everything that isn't a headline or an image.
 */
export default function Reveal({
  children,
  className,
  y = 48,
  delay = 0,
  duration = 1.2,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : el;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
