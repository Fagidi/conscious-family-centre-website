import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";

/**
 * Mission — a dedicated statement section (TAS-style two-column: small label
 * left, large statement right). Reuses the existing mission copy.
 */
export default function MissionSection({ statement }: { statement: string }) {
  return (
    <Section tone="cream" spacing="xl">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Our mission</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-display-md font-display text-forest-900">{statement}</p>
        </Reveal>
      </div>
    </Section>
  );
}
