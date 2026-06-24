import { getTeamMember, getTeamSlugs } from "@/lib/data";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import Button from "@/components/ui/Button";

export async function generateStaticParams() {
  const slugs = await getTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) return { title: "Not Found" };

  return {
    title: `${member.name} | Conscious Family Centre`,
    description: member.shortBio || `Learn more about ${member.name}`,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-svh">
      <section className="relative pt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-site px-gutter">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start">
            <div>
              <Link
                href="/about/team"
                className="inline-flex items-center gap-1 text-sm font-semibold text-leaf-600 hover:text-leaf-700 mb-6"
              >
                &larr; Back to team
              </Link>

              {member.founder && (
                <span className="inline-block bg-leaf-600 text-cream text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Founder
                </span>
              )}

              <h1 className="font-display text-5xl md:text-6xl font-medium text-forest-900 mb-3">
                {member.name}
              </h1>

              <p className="text-2xl text-bark-700/70 mb-2">{member.role}</p>

              {member.department && (
                <p className="text-sm text-bark-700/50 capitalize mb-8">
                  {member.department}
                </p>
              )}

              {member.fullBio &&
              Array.isArray(member.fullBio) &&
              member.fullBio.length > 0 ? (
                <div className="prose prose-lg prose-forest max-w-none text-bark-700/80 mb-8">
                  <PortableText value={member.fullBio} />
                </div>
              ) : member.shortBio ? (
                <p className="text-lg leading-relaxed text-bark-700/80 mb-8">
                  {member.shortBio}
                </p>
              ) : null}

              {member.qualifications && member.qualifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-semibold text-forest-900 mb-4">
                    Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {member.qualifications.map((qual, i) => (
                      <li key={i} className="flex gap-3 text-bark-700/80">
                        <span className="text-leaf-600 font-semibold">
                          &#10003;
                        </span>
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {member.email && (
                  <Button href={`mailto:${member.email}`} variant="secondary">
                    Email {member.name.split(" ")[0]}
                  </Button>
                )}
                <Button href="/contact">Get in touch</Button>
              </div>

              {(member.socialLinks?.linkedin ||
                member.socialLinks?.instagram ||
                member.socialLinks?.twitter) && (
                <div className="flex gap-4 mt-6">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.socialLinks.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              )}
            </div>

            {member.photo && (
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-forest-700/10">
                <SmartImage
                  image={member.photo}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
