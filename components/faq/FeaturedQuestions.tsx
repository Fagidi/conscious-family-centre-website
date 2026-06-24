import type { FaqItem, FaqPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import FaqPageAccordion from "./FaqPageAccordion";

interface FeaturedQuestionsProps {
  content: FaqPageContent["featured"];
  items: FaqItem[];
}

/** The most-asked questions, surfaced near the top of the page. */
export default function FeaturedQuestions({ content, items }: FeaturedQuestionsProps) {
  if (items.length === 0) return null;

  return (
    <Section tone="cream" spacing="lg">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} />
        <Reveal delay={0.05}>
          <FaqPageAccordion items={items} idPrefix="featured" />
        </Reveal>
      </div>
    </Section>
  );
}
