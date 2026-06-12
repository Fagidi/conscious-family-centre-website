"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total vertical drift as a percentage of element height. */
  amount?: number;
}

/**
 * Smooth scrub-linked parallax. The child drifts slowly against the
 * scroll for quiet depth — used on large imagery, never on text.
 */
export default function Parallax({ children, className, amount = 12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelector("[data-parallax-inner]");

      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div
        data-parallax-inner
        className="relative h-[115%] -top-[7.5%] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
