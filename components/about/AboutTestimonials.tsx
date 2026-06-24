import type { AboutContent, Testimonial } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface AboutTestimonialsProps {
  content: AboutContent["testimonials"];
  testimonials: Testimonial[];
}

/**
 * Parent Testimonials — premium editorial treatment. The first quote is
 * emphasised as a large pull-quote; the rest follow as cards. CMS-driven.
 */
export default function AboutTestimonials({ content, testimonials }: AboutTestimonialsProps) {
  if (testimonials.length === 0) return null;

  const [lead, ...rest] = testimonials;

  return (
    <Section tone="cream" spacing="lg">
      <SectionHeading eyebrow={content.eyebrow} title={content.heading} align="center" className="mx-auto" />

      <Reveal className="mx-auto mt-12 max-w-3xl text-center">
        <span aria-hidden className="font-display text-6xl leading-none text-leaf-600/30">“</span>
        <blockquote className="mt-2 font-display text-2xl italic leading-snug text-forest-900 md:text-3xl">
          {lead.quote}
        </blockquote>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-bark-700/70">
          {lead.authorName}
          {lead.childAge ? ` · ${lead.childAge}` : ""}
        </p>
      </Reveal>

      {rest.length > 0 && (
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 3).map((t, i) => (
            <StaggerItem key={i} className="h-full">
              <TestimonialCard testimonial={t} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Section>
  );
}
