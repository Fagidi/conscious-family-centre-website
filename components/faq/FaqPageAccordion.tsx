"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface FaqPageAccordionProps {
  items: FaqItem[];
  /** Search term to highlight inside questions. */
  highlight?: string;
  /** When true, syncs the open item with the URL hash and shows a copy-link control. */
  deepLink?: boolean;
  /** DOM id prefix so multiple accordions on a page don't collide. */
  idPrefix?: string;
}

/** Highlight the first match of `q` within `text`. */
function withHighlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-sun-400/40 px-0.5 text-inherit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/**
 * Premium, accessible FAQ accordion (disclosure pattern). Supports deep links
 * (URL hash ↔ open item), a copy-link control, search highlighting, and smooth
 * height animation. Only string answers render (Portable Text rendering is
 * deferred until a renderer is added — see FaqAccordion note).
 */
export default function FaqPageAccordion({
  items,
  highlight = "",
  deepLink = false,
  idPrefix = "faq",
}: FaqPageAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const itemId = (item: FaqItem) => `${idPrefix}-${slugify(item.question)}`;

  // Open the item referenced by the URL hash on mount (deep linking).
  useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    setOpenId(hash);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [deepLink]);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (deepLink && typeof window !== "undefined") {
      const base = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", next ? `#${next}` : base);
    }
  };

  const copyLink = async (id: string) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="divide-y divide-forest-700/10 border-y border-forest-700/10">
      {items.map((item) => {
        const id = itemId(item);
        const isOpen = openId === id;
        const answer = typeof item.answer === "string" ? item.answer : "";
        return (
          <div key={id} id={id} className="scroll-mt-28">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-trigger`}
                onClick={() => toggle(id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium text-forest-900"
              >
                <span>{withHighlight(item.question, highlight)}</span>
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl leading-none text-leaf-600 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-trigger`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pr-8">
                    <p className="text-bark-700/80">{answer}</p>
                    {deepLink && (
                      <button
                        type="button"
                        onClick={() => copyLink(id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-leaf-600 hover:text-forest-700 focus-visible:outline-none focus-visible:underline"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                        </svg>
                        {copiedId === id ? "Link copied!" : "Copy link"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
