"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Reveal from "@/components/animation/Reveal";
import type { Testimonial } from "@/lib/types";

/**
 * One large editorial quote at a time, crossfading on a slow cadence
 * with manual control — restraint over carousel theatrics.
 */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (next: number) => {
    const el = quoteRef.current;
    if (!el) return;
    gsap.to(el, {
      autoAlpha: 0,
      y: -18,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setIndex(((next % items.length) + items.length) % items.length);
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
        );
      },
    });
  };

  useEffect(() => {
    timer.current = setInterval(() => go(index + 1), 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  const current = items[index];

  return (
    <section className="bg-noir-soft py-32 md:py-44">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow mb-14 flex items-center gap-4 justify-center">
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            In Their Words
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
          </p>
        </Reveal>

        <div className="mx-auto max-w-4xl text-center">
          <div ref={quoteRef}>
            <blockquote>
              <p className="font-display text-display-sm font-light italic leading-snug text-ivory">
                &ldquo;{current.quote}&rdquo;
              </p>
            </blockquote>
            <p className="mt-10 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-ivory">
              {current.author}
            </p>
            <p className="mt-2 text-[0.66rem] uppercase tracking-[0.26em] text-ivory-faint">
              {current.event}
            </p>
          </div>

          {/* Pagination */}
          <div className="mt-14 flex items-center justify-center gap-3">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-px transition-all duration-500 ease-luxe ${
                  i === index ? "w-12 bg-amethyst" : "w-6 bg-noir-line hover:bg-ivory-faint"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
