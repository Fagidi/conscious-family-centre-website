import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import SmartImage from "@/components/ui/SmartImage";
import Section from "@/components/ui/Section";
import Link from "next/link";

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
  const isCMSPopulated = team.length > 0;

  return (
    <>
      <PageHero
        title="Meet The Team"
        intro="The caring, intentional people who make CFC home"
      />

      <Section tone="white" spacing="lg">
        {!isCMSPopulated && (
          <div className="mb-12 p-6 rounded-xl bg-sage-100 border border-sage-200">
            <p className="text-sm text-bark-700/70 text-center">
              💡 <strong>Tip:</strong> Team members can be added in Sanity CMS Studio at /studio
            </p>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayTeam.map((member) => (
            <div
              key={member.slug}
              className="group rounded-2xl border border-forest-700/10 bg-cream overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-forest-700/10 overflow-hidden">
                {/* Placeholder avatar with initials */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-leaf-600/20 to-leaf-700/20">
                  <span className="text-5xl font-bold text-leaf-600 opacity-30">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-1">
                  {member.name}
                </h3>

                <p className="text-sm font-semibold text-leaf-600 mb-4">
                  {member.role}
                </p>

                {member.bio && (
                  <p className="text-sm text-bark-700/70 mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {/* Qualifications preview */}
                {member.qualifications && member.qualifications.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {member.qualifications.slice(0, 2).map((qual, i) => (
                      <p key={i} className="text-xs text-bark-700/60 flex items-center gap-2">
                        <span className="text-leaf-600">✓</span> {qual}
                      </p>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/about/team/${member.slug}`}
                  className="inline-flex text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {displayTeam.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-bark-700/70 mb-6">
              No team members added yet.
            </p>
            <p className="text-sm text-bark-700/60">
              Team members will appear here once added to Sanity CMS.
            </p>
          </div>
        )}
      </Section>

      {/* CMS Info */}
      <Section tone="sage" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-4">
            Add Team Members
          </h2>
          <p className="text-lg text-bark-700/85 mb-8">
            Team members are managed in Sanity CMS. Each team member includes:
          </p>
          <div className="grid gap-6 sm:grid-cols-3 text-left mb-8">
            <div>
              <p className="font-semibold text-forest-900 mb-2">📝 Name & Role</p>
              <p className="text-sm text-bark-700/70">Full name and job title</p>
            </div>
            <div>
              <p className="font-semibold text-forest-900 mb-2">📷 Photo</p>
              <p className="text-sm text-bark-700/70">Profile image</p>
            </div>
            <div>
              <p className="font-semibold text-forest-900 mb-2">✨ Bio</p>
              <p className="text-sm text-bark-700/70">Background & qualifications</p>
            </div>
          </div>
          <a
            href="/studio"
            className="inline-flex px-8 py-3 rounded-full bg-leaf-600 text-cream font-semibold hover:bg-leaf-700 transition-colors"
          >
            Go to Sanity CMS →
          </a>
        </div>
      </Section>
    </>
  );
}
