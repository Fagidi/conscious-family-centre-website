import type { HomeContent, ProgramPreview } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProgramCard from "@/components/cards/ProgramCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface ProgramsPreviewProps {
  content: HomeContent["programs"];
  programs: ProgramPreview[];
}

/** Featured programs with editorial spacing and prominent CTA. */
export default function ProgramsPreview({ content, programs }: ProgramsPreviewProps) {
  if (programs.length === 0) return null;

  return (
    <Section tone="white" spacing="lg">
      <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} className="max-w-2xl" />
        <div className="hidden sm:block flex-shrink-0">
          <Button href={content.cta.href} variant="primary">
            {content.cta.label}
          </Button>
        </div>
      </div>

      {/* Editorial grid with generous spacing */}
      <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {programs.slice(0, 3).map((program) => (
          <StaggerItem key={program.slug}>
            <ProgramCard program={program} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-12 flex flex-col gap-4 sm:hidden">
        <Button href={content.cta.href} variant="primary" className="w-full">
          {content.cta.label}
        </Button>
        {programs.length > 3 && (
          <p className="text-center text-sm text-bark-700/70">
            {programs.length - 3} more program{programs.length - 3 !== 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </Section>
  );
}
