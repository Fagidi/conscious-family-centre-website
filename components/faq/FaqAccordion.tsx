"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Reveal from "@/components/animation/Reveal";
import type { FaqItem } from "@/lib/types";

/**
 * Grouped accordion with GSAP height easing. One panel open at a time;
 * generous type and hairline rules keep it editorial.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const [open, setOpen] = useState<string | null>(items[0]?.question ?? null);
  const panels = useRef(new Map<string, HTMLDivElement>());

  const toggle = (question: string) => {
    const next = open === question ? null : question;

    panels.current.forEach((panel, key) => {
      const shouldOpen = key === next;
      gsap.to(panel, {
        height: shouldOpen ? "auto" : 0,
        autoAlpha: shouldOpen ? 1 : 0,
        duration: 0.7,
        ease: "power3.inOut",
      });
    });

    setOpen(next);
  };

  return (
    <div className="space-y-20">
      {categories.map((category) => (
        <div key={category}>
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4 text-amethyst-bright">
              <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
              {category}
            </p>
          </Reveal>

          <Reveal stagger={0.06}>
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const isOpen = open === item.question;
                return (
                  <div key={item.question} className="border-b border-noir-line">
                    <button
                      type="button"
                      onClick={() => toggle(item.question)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-baseline justify-between gap-8 py-7 text-left"
                    >
                      <span
                        className={`font-display text-xl font-light transition-colors duration-500 md:text-2xl ${
                          isOpen ? "text-amethyst-bright" : "text-ivory group-hover:text-amethyst-bright"
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden
                        className={`shrink-0 font-display text-2xl font-light text-ivory-dim transition-transform duration-500 ease-luxe ${
                          isOpen ? "rotate-45 text-amethyst-bright" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      ref={(el) => {
                        if (el) {
                          panels.current.set(item.question, el);
                          // initial state
                          if (open !== item.question) {
                            el.style.height = "0px";
                            el.style.opacity = "0";
                            el.style.visibility = "hidden";
                          }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-sm font-light leading-loose text-ivory-dim">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
          </Reveal>
        </div>
      ))}
    </div>
  );
}
