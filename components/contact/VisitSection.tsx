import type { ContactPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-1 h-4 w-4 shrink-0 text-leaf-600">
      <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Book-a-visit section — benefits of visiting + CTA (calendar-ready). */
export default function VisitSection({ visit }: { visit: ContactPageContent["visit"] }) {
  return (
    <Section tone="sage" spacing="lg">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3">{visit.eyebrow}</p>
          <h2 className="text-display-md">{visit.heading}</h2>
          {visit.description && <p className="mt-4 text-lg leading-relaxed text-bark-700/85">{visit.description}</p>}
          <div className="mt-8">
            <Button href={visit.cta.href}>{visit.cta.label}</Button>
          </div>
        </Reveal>

        <Stagger className="space-y-3 lg:pt-4">
          {visit.benefits.map((benefit) => (
            <StaggerItem
              key={benefit}
              className="flex items-start gap-3 rounded-card-lg border border-forest-700/10 bg-white p-5 shadow-soft"
            >
              <Check />
              <span className="text-bark-700/90">{benefit}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
