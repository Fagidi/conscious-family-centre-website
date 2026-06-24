import type { Testimonial } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface ProgramTestimonialsProps {
  eyebrow?: string;
  heading: string;
  testimonials: Testimonial[];
}

/** Program testimonials — motion-enhanced editorial cards (CMS-driven). */
export default function ProgramTestimonials({ eyebrow, heading, testimonials }: ProgramTestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <Section tone="cream" spacing="lg">
      <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="mx-auto" />

      <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((t, i) => (
          <StaggerItem key={i} className="h-full">
            <TestimonialCard testimonial={t} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
