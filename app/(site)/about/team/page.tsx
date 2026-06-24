import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import TeamMemberCard from "@/components/about/TeamMemberCard";

export const metadata: Metadata = {
  title: "Meet The Team | Conscious Family Centre",
  description:
    "The caring, intentional people who make Conscious Family Centre home",
};

export default async function TeamPage() {
  const team = await getTeam();

  const founder = team.find((m) => m.founder);
  const staff = team.filter((m) => !m.founder);

  return (
    <>
      <PageHero
        title="Meet The Team"
        intro="The caring, intentional people who make CFC home"
      />

      {founder && (
        <Section tone="sage" spacing="lg">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-leaf-600 mb-2">
              Our Founder
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <TeamMemberCard member={founder} />
          </div>
        </Section>
      )}

      <Section tone="white" spacing="lg">
        {staff.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <TeamMemberCard key={member.slug} member={member} />
            ))}
          </div>
        ) : (
          <div className="rounded-card-lg border border-forest-700/10 bg-cream p-10 text-center shadow-soft">
            <p className="mx-auto max-w-prose text-lg text-bark-700/80">
              We can&apos;t wait to introduce you to the people who care for
              your children every day. The best way to meet them is in person.
            </p>
            <div className="mt-6">
              <Button href="/contact">Book a Visit</Button>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
