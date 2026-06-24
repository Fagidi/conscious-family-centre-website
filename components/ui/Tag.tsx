import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "leaf" | "clay" | "sun" | "sage" | "forest";

const tones: Record<Tone, string> = {
  leaf: "bg-leaf-500/15 text-leaf-600",
  clay: "bg-clay-500/15 text-clay-600",
  sun: "bg-sun-400/20 text-bark-700",
  sage: "bg-sage-200 text-forest-900",
  forest: "bg-forest-900 text-cream",
};

interface TagProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

/** Pill badge for age bands, categories, and "spots left" signals. */
export default function Tag({ children, tone = "sage", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
