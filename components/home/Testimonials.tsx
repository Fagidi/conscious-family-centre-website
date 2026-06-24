import type { HomeContent, Testimonial } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface TestimonialsProps {
  content: HomeContent["testimonials"];
  testimonials: Testimonial[];
}

/** Testimonials — editorial, motion-enhanced cards (CMS-driven). */
export default function Testimonials({ content, testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <Section tone="sage" spacing="lg">
      <SectionHeading eyebrow={content.eyebrow} title={content.heading} align="center" className="mx-auto" />

      <Stagger className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((t, i) => (
          <StaggerItem key={i} className="h-full">
            <TestimonialCard testimonial={t} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
