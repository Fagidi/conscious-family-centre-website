import type { ContactPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/** Getting-started timeline — numbered steps from first hello to belonging. */
export default function JourneyTimeline({ journey }: { journey: ContactPageContent["journey"] }) {
  if (!journey.steps?.length) return null;

  return (
    <Section tone="cream" spacing="lg">
      <SectionHeading eyebrow={journey.eyebrow} title={journey.heading} intro={journey.intro} className="max-w-2xl" />

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(journey.steps ?? []).map((step, i) => (
          <StaggerItem key={step.title} className="relative">
            {/* Connector line (desktop) */}
            {i < (journey.steps ?? []).length - 1 && (
              <span aria-hidden className="absolute left-12 top-6 hidden h-px w-full bg-forest-700/15 lg:block" />
            )}
            <div className="relative">
              <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-leaf-600 font-display text-lg font-semibold text-cream">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-forest-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-700/80">{step.description}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
