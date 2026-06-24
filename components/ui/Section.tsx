import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

interface SectionProps {
  children: ReactNode;
  /** Background tone from the palette. */
  tone?: "cream" | "sage" | "forest" | "white";
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg" | "xl";
  width?: "content" | "site" | "prose";
  className?: string;
  id?: string;
}

const tones = {
  cream: "bg-cream text-bark-700",
  sage: "bg-sage-100 text-bark-700",
  forest: "bg-forest-900 text-cream",
  white: "bg-white text-bark-700",
};

const spacings = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-28 md:py-40", // premium breathing room for editorial sections
};

/** Full-bleed section band with a tone + an inner Container. */
export default function Section({
  children,
  tone = "cream",
  spacing = "md",
  width = "content",
  className,
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], spacings[spacing], className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}
