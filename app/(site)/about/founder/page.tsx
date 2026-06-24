import type { Metadata } from "next";
import { getFounder } from "@/lib/data";
import { PortableText } from "@portabletext/react";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

export async function generateMetadata(): Promise<Metadata> {
  const founder = await getFounder();
  return {
    title: founder
      ? `${founder.name} — Founder | Conscious Family Centre`
      : "Founder | Conscious Family Centre",
    description: founder?.shortBio ?? "Learn about the founder and vision behind Conscious Family Centre",
  };
}

export default async function FounderPage() {
  const founder = await getFounder();

  if (!founder) {
    return (
      <>
        <PageHero
          title="The Founder"
          intro="The vision, philosophy, and journey behind Conscious Family Centre"
        />
        <Section tone="white" spacing="lg">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-bark-700/70 mb-8">
              Founder information is coming soon. In the meantime, feel free to
              get in touch to learn more about us.
            </p>
            <Button href="/contact">Get in Touch</Button>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="The Founder"
        intro="The vision, philosophy, and journey behind Conscious Family Centre"
      />

      {/* Founder hero profile */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start max-w-5xl mx-auto">
          {founder.photo?.src && (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-forest-700/10">
              <SmartImage
                image={founder.photo}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-forest-900 mb-2">
              {founder.name}
            </h2>

            <p className="text-xl text-leaf-600 font-semibold mb-6">
              {founder.role}
            </p>

            {founder.shortBio && (
              <p className="text-lg leading-relaxed text-bark-700/85 mb-6">
                {founder.shortBio}
              </p>
            )}

            {founder.fullBio && Array.isArray(founder.fullBio) && founder.fullBio.length > 0 && (
              <div className="prose prose-lg prose-forest max-w-none text-bark-700/85 mb-8">
                <PortableText value={founder.fullBio} />
              </div>
            )}

            {founder.qualifications && founder.qualifications.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-4">
                  Qualifications &amp; Background
                </h3>
                <ul className="space-y-2">
                  {founder.qualifications.map((qual, i) => (
                    <li key={i} className="flex gap-3 text-bark-700/80">
                      <span className="text-leaf-600 font-semibold">&#10003;</span>
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(founder.email || founder.socialLinks) && (
              <div className="flex flex-wrap gap-4 mb-6">
                {founder.email && (
                  <a
                    href={`mailto:${founder.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                )}
                {founder.socialLinks?.linkedin && (
                  <a
                    href={founder.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {founder.socialLinks?.instagram && (
                  <a
                    href={founder.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Philosophy & Vision storytelling sections */}
      {(founder.founderPhilosophy || founder.founderVision) && (
        <Section tone="sage" spacing="lg">
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
            {founder.founderPhilosophy && (
              <div>
                <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
                  Founding Philosophy
                </h3>
                <p className="text-lg leading-relaxed text-bark-700/85">
                  {founder.founderPhilosophy}
                </p>
              </div>
            )}

            {founder.founderVision && (
              <div>
                <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
                  Vision for the Future
                </h3>
                <p className="text-lg leading-relaxed text-bark-700/85">
                  {founder.founderVision}
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section tone="white" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-bark-700/70 mb-8">
            Interested in our approach to nature-connected learning?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/about" variant="primary">
              Explore Our Story
            </Button>
            <Button href="/about/team" variant="secondary">
              Meet The Team
            </Button>
            <Button href="/contact" variant="ghost">
              Get in Touch
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
