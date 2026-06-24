import type { ProgramsPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * Why Our Programs Matter — outcomes-focused icon cards on a striking dark band
 * (confidence, creativity, curiosity, connection, independence).
 */
export default function ProgramOutcomes({ outcomes }: { outcomes: ProgramsPageContent["outcomes"] }) {
  return (
    <Section tone="forest" spacing="lg">
      <Reveal className="mx-auto max-w-2xl text-center">
        {outcomes.eyebrow && <p className="eyebrow mb-3 text-sun-400">{outcomes.eyebrow}</p>}
        <h2 className="text-display-md text-cream">{outcomes.heading}</h2>
        {outcomes.intro && <p className="mt-4 text-lg leading-relaxed text-cream/75">{outcomes.intro}</p>}
      </Reveal>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {outcomes.cards.map((card) => (
          <StaggerItem
            key={card.title}
            className="group rounded-card-lg border border-cream/15 bg-cream/[0.04] p-6 text-center transition-colors duration-500 ease-organic hover:bg-cream/[0.08]"
          >
            <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-sun-400 transition-colors duration-500 group-hover:bg-sun-400 group-hover:text-forest-900">
              <Icon name={card.icon ?? "leaf"} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold text-cream">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/75">{card.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
