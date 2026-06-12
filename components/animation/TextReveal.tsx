"use client";

import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TextRevealProps {
  /** Each string renders as one masked line of the headline. */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate immediately on mount (heroes) instead of on scroll. */
  immediate?: boolean;
}

/**
 * Editorial masked-line reveal: each line rises out of an
 * overflow-hidden mask with a luxury ease and slight stagger.
 */
export default function TextReveal({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll("[data-line]");

      gsap.fromTo(
        targets,
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.4,
          delay,
          stagger: 0.12,
          ease: "power4.out",
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: "top 86%", once: true } }),
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span data-line className={`block will-change-transform ${lineClassName ?? ""}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
