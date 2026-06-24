import type { ProgramsPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/** Program Overview — the shared learning philosophy, editorial split layout. */
export default function ProgramOverview({ overview }: { overview: ProgramsPageContent["overview"] }) {
  return (
    <Section tone="cream" spacing="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3">{overview.eyebrow}</p>
          <h2 className="text-display-md">{overview.heading}</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-bark-700/85">
            {overview.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal preset="scaleIn" className="relative aspect-[5/4] overflow-hidden rounded-card-lg shadow-lift lg:order-last">
          <SmartImage image={overview.image} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </Reveal>
      </div>
    </Section>
  );
}
