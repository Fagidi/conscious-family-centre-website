import type { AboutContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * Our Philosophy — premium storytelling cards. Each belief is numbered for
 * hierarchy, with an icon and short description. Calm, staggered reveal.
 */
export default function Philosophy({ philosophy }: { philosophy: AboutContent["philosophy"] }) {
  return (
    <Section tone="sage" spacing="lg">
      <SectionHeading
        eyebrow={philosophy.eyebrow}
        title={philosophy.heading}
        intro={philosophy.intro}
        className="max-w-2xl"
      />

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2">
        {(philosophy.cards ?? []).map((card, i) => (
          <StaggerItem
            key={card.title}
            className="group relative flex flex-col rounded-card-lg border border-forest-700/10 bg-white p-8 shadow-soft transition-shadow duration-500 ease-organic hover:shadow-lift"
          >
            <span aria-hidden className="font-display text-sm font-semibold text-leaf-600/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-leaf-600 transition-colors duration-500 group-hover:bg-leaf-600 group-hover:text-cream">
              <Icon name={card.icon ?? "leaf"} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-forest-900">{card.title}</h3>
            <p className="mt-2 text-bark-700/80">{card.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
