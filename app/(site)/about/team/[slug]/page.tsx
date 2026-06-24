import { getTeamMember, getTeamSlugs } from "@/lib/data";
import { notFound } from "next/navigation";
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
    description: member.bio || `Learn more about ${member.name}`,
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
                ← Back to team
              </Link>

              <h1 className="font-display text-5xl md:text-6xl font-medium text-forest-900 mb-3">
                {member.name}
              </h1>

              <p className="text-2xl text-bark-700/70 mb-8">{member.role}</p>

              {member.bio && (
                <p className="text-lg leading-relaxed text-bark-700/80 mb-8">
                  {member.bio}
                </p>
              )}

              {member.qualifications && member.qualifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-semibold text-forest-900 mb-4">
                    Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {member.qualifications.map((qual, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-bark-700/80"
                      >
                        <span className="text-leaf-600 font-semibold">✓</span>
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button href="/contact">Get in touch</Button>
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
