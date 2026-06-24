import type { ProgramsPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * Learning Through Experience — nature learning, creative exploration, family
 * engagement, community connection. Calm storytelling cards.
 */
export default function LearningThroughExperience({
  experience,
}: {
  experience: ProgramsPageContent["experience"];
}) {
  return (
    <Section tone="sage" spacing="lg">
      <SectionHeading
        eyebrow={experience.eyebrow}
        title={experience.heading}
        intro={experience.intro}
        className="max-w-2xl"
      />

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {experience.items.map((item) => (
          <StaggerItem
            key={item.title}
            className="group rounded-card-lg border border-forest-700/10 bg-white p-7 shadow-soft transition-shadow duration-500 ease-organic hover:shadow-lift"
          >
            <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-leaf-600 transition-colors duration-500 group-hover:bg-leaf-600 group-hover:text-cream">
              <Icon name={item.icon ?? "leaf"} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold text-forest-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-bark-700/80">{item.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
