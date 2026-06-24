import type { AboutContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * What Makes Us Different — a deliberately striking dark band. Icon cards on
 * forest-900 give the page a confident, premium pause before the lighter
 * environment + team sections.
 */
export default function Differentiators({ differentiators }: { differentiators: AboutContent["differentiators"] }) {
  return (
    <Section tone="forest" spacing="lg">
      <Reveal className="mx-auto max-w-2xl text-center">
        {differentiators.eyebrow && (
          <p className="eyebrow mb-3 text-sun-400">{differentiators.eyebrow}</p>
        )}
        <h2 className="text-display-md text-cream">{differentiators.heading}</h2>
        {differentiators.intro && (
          <p className="mt-4 text-lg leading-relaxed text-cream/75">{differentiators.intro}</p>
        )}
      </Reveal>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {differentiators.items.map((item) => (
          <StaggerItem
            key={item.title}
            className="group rounded-card-lg border border-cream/15 bg-cream/[0.04] p-7 transition-colors duration-500 ease-organic hover:bg-cream/[0.08]"
          >
            <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-sun-400 transition-colors duration-500 group-hover:bg-sun-400 group-hover:text-forest-900">
              <Icon name={item.icon ?? "leaf"} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold text-cream">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/75">{item.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
