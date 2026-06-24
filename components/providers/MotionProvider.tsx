"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global Framer Motion config. `reducedMotion="user"` makes every motion
 * component honor prefers-reduced-motion automatically (risk review C/§13).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
