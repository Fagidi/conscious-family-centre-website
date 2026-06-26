import type { HomeContent, FaqItem } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import FaqAccordion from "@/components/faq/FaqAccordion";

interface FaqPreviewProps {
  content: HomeContent["faq"];
  faqs: FaqItem[];
}

/** Top FAQs in a two-column editorial layout, with a "View All FAQs" CTA. */
export default function FaqPreview({ content, faqs }: FaqPreviewProps) {
  if (faqs.length === 0) return null;

  return (
    <Section tone="white" spacing="lg">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={content.eyebrow} title={content.heading} />
          <div className="mt-10 hidden lg:block">
            {content.cta && (
              <Button href={content.cta.href} variant="primary">
                {content.cta.label}
              </Button>
            )}
          </div>
        </div>

        <Reveal>
          <FaqAccordion items={faqs.slice(0, 5)} />
          <div className="mt-10 lg:hidden">
            <Button href={content.cta.href} variant="primary" className="w-full">
              {content.cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
