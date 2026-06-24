"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem, inViewport } from "@/lib/motion";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  gap?: number;
}

/** Container that cascades direct <StaggerItem> children into view. */
export function Stagger({ children, className, gap = 0.08 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(gap)}
      initial="hidden"
      whileInView="show"
      viewport={inViewport}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
