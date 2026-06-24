import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow + display headline + optional intro — the standard section opener. */
export default function SectionHeading({ eyebrow, title, intro, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-prose", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-display-md">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-bark-700/80">{intro}</p>}
    </div>
  );
}
