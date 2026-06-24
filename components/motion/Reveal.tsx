"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeIn, scaleIn, inViewport } from "@/lib/motion";

type Preset = "fadeUp" | "fadeIn" | "scaleIn";
const presets = { fadeUp, fadeIn, scaleIn };

interface RevealProps {
  children: ReactNode;
  preset?: Preset;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

/**
 * Scroll-into-view reveal — the house entrance for non-headline content.
 * Reduced-motion is honored automatically by Framer's `MotionConfig`
 * (set in the site layout); the element is always present in the DOM, so
 * content is never JS-hidden from crawlers/LCP (risk review C5).
 */
export default function Reveal({ children, preset = "fadeUp", delay = 0, className, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={presets[preset]}
      initial="hidden"
      whileInView="show"
      viewport={inViewport}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
