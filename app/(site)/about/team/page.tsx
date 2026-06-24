import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import TeamMemberCard from "@/components/about/TeamMemberCard";

export const metadata: Metadata = {
  title: "Meet The Team | Conscious Family Centre",
  description: "The caring, intentional people who make Conscious Family Centre home",
};

// Default team members (for CMS population later)
const DEFAULT_TEAM = [
  {
    name: "Team Member 1",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-1",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
  {
    name: "Team Member 2",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-2",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
  {
    name: "Team Member 3",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-3",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
  {
    name: "Team Member 4",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-4",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
  {
    name: "Team Member 5",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-5",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
  {
    name: "Team Member 6",
    role: "Position Title",
    bio: "Brief bio to be added in Sanity CMS",
    slug: "team-member-6",
    qualifications: ["Qualification 1", "Qualification 2"],
  },
];

export default async function TeamPage() {
  const team = await getTeam();

  // Use CMS data if available, otherwise use defaults for design preview
  const displayTeam = team.length > 0 ? team : DEFAULT_TEAM;

  return (
    <>
      <PageHero
        title="Meet The Team"
        intro="The caring, intentional people who make CFC home"
      />

      <Section tone="white" spacing="lg">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayTeam.map((member) => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>

        {displayTeam.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-bark-700/70">
              No team members added yet.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
