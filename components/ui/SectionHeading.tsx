import TextReveal from "@/components/animation/TextReveal";
import Reveal from "@/components/animation/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  lines: string[];
  className?: string;
  headingClassName?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Eyebrow + masked-line display headline, the recurring editorial
 * lockup used to open every section.
 */
export default function SectionHeading({
  eyebrow,
  lines,
  className = "",
  headingClassName = "font-display text-display-md font-light",
  as = "h2",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal y={24} duration={1}>
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <TextReveal as={as} lines={lines} className={headingClassName} />
    </div>
  );
}
