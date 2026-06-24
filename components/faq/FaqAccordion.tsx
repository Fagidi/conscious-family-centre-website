"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/lib/types";

/**
 * Accessible FAQ accordion (disclosure pattern): button toggles an
 * aria-controlled region; only string answers render here (Portable Text
 * answers will use @portabletext/react when richer FAQ pages are built).
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-forest-700/10 border-y border-forest-700/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const answer = typeof item.answer === "string" ? item.answer : "";
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium text-forest-900"
              >
                {item.question}
                <span aria-hidden className={`shrink-0 text-leaf-600 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-bark-700/80">{answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
