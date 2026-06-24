import type { FaqItem } from "@/lib/types";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import FaqAccordion from "@/components/faq/FaqAccordion";

interface ProgramFaqSectionProps {
  eyebrow?: string;
  heading: string;
  faqs: FaqItem[];
  /** Optional "view all" link. */
  cta?: { label: string; href: string };
}

/** Program FAQ — two-column heading + accessible accordion. */
export default function ProgramFaqSection({ eyebrow, heading, faqs, cta }: ProgramFaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <Section tone="sage" spacing="lg">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-display-md">{heading}</h2>
          {cta && (
            <div className="mt-6">
              <Button href={cta.href} variant="ghost">
                {cta.label}
              </Button>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.05}>
          <FaqAccordion items={faqs} />
        </Reveal>
      </div>
    </Section>
  );
}
