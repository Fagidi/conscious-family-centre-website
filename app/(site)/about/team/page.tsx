import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meet The Team | Conscious Family Centre",
  description: "The caring, intentional people who make Conscious Family Centre home",
};

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero
        title="Meet The Team"
        intro="The caring, intentional people who make CFC home"
      />

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-site px-gutter">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/about/team/${member.slug}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-forest-700/10 aspect-square mb-4 group-hover:shadow-lg transition-shadow">
                  {member.photo && (
                    <SmartImage
                      image={member.photo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-900 group-hover:text-leaf-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-bark-700/70 mt-1">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-bark-700/60 mt-3 line-clamp-2">
                    {member.bio}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {team.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-bark-700/70">
                Team members coming soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
