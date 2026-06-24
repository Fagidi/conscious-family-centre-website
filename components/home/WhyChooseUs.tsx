import type { HomeContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/** "Why Families Choose Us" — premium editorial grid with large icons and whitespace. */
export default function WhyChooseUs({ content }: { content: HomeContent["why"] }) {
  return (
    <Section tone="cream" spacing="lg">
      <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} className="max-w-2xl" />

      <Stagger className="mt-20 grid gap-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {content.pillars.map((pillar, i) => (
          <StaggerItem key={pillar.title} className="flex flex-col">
            {/* Large, prominent icon */}
            <span className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-600/10 text-leaf-600">
              <Icon name={pillar.icon ?? "leaf"} className="h-8 w-8" />
            </span>

            {/* Title and description */}
            <h3 className="font-display text-2xl font-semibold text-forest-900">
              {pillar.title}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-bark-700/80">
              {pillar.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
