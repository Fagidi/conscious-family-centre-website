import type { AboutContent, TeamMember } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TeamCard from "@/components/cards/TeamCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface MeetTheTeamProps {
  content: AboutContent["team"];
  team: TeamMember[];
}

/**
 * Meet the Team — CMS-driven grid of educators/facilitators. When no team
 * members exist yet we show an honest, conversion-friendly empty state rather
 * than inventing people (content rule).
 */
export default function MeetTheTeam({ content, team }: MeetTheTeamProps) {
  return (
    <Section tone="sage" spacing="lg">
      <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} className="max-w-2xl" />

      {team.length > 0 ? (
        <Stagger className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <StaggerItem key={member.slug || member.name}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="mt-12 rounded-card-lg border border-forest-700/10 bg-white p-10 text-center shadow-soft">
          <p className="mx-auto max-w-prose text-lg text-bark-700/80">
            We can&apos;t wait to introduce you to the people who care for your children every day. The best way to
            meet them is in person.
          </p>
          <div className="mt-6">
            <Button href="/contact">Book a Visit</Button>
          </div>
        </div>
      )}
    </Section>
  );
}
