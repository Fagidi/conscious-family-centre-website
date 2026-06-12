"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Cinematic image entrance: the frame unclips from the bottom while
 * the image itself settles from a gentle overscale — a curtain lift.
 * Wrap a fill-mode next/image (parent must be position-relative).
 */
export default function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelector("[data-image-inner]");

      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" },
      ).fromTo(
        inner,
        { scale: 1.18 },
        { scale: 1, duration: 1.9, ease: "power3.out" },
        "<",
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <div data-image-inner className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
