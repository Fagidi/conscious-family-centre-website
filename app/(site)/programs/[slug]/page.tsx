import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgram, getProgramSlugs, getTestimonialsByProgram } from "@/lib/data";
import { AGE_BANDS } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";
import Section from "@/components/ui/Section";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/motion/Reveal";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramTimeline from "@/components/programs/ProgramTimeline";
import ProgramGallery from "@/components/programs/ProgramGallery";
import ProgramFaqSection from "@/components/programs/ProgramFaqSection";
import ProgramTestimonials from "@/components/programs/ProgramTestimonials";
import ProgramCTA from "@/components/programs/ProgramCTA";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program not found" };
  const seo = program.seo ?? { title: program.title, description: program.summary };
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/programs/${program.slug}`,
      type: "website",
      images: program.heroImage?.src ? [{ url: program.heroImage.src }] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const testimonials = await getTestimonialsByProgram(slug);

  const galleryItems: GalleryItem[] = program.gallery.map((image) => ({ image, tags: [] }));

  const facts: { label: string; value: string }[] = [
    { label: "Ages", value: program.ageBands.map((b) => AGE_BANDS[b]?.range ?? b).join(", ") },
    ...(program.ratio ? [{ label: "Ratio", value: program.ratio }] : []),
    ...(program.groupSize ? [{ label: "Group size", value: program.groupSize }] : []),
    ...(program.schedule ? [{ label: "Schedule", value: program.schedule }] : []),
  ];

  // JSON-LD: EducationalOccupationalProgram + FAQPage + breadcrumb.
  const programSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: program.title,
    description: program.summary,
    url: `${siteUrl}/programs/${program.slug}`,
    provider: { "@type": "Organization", name: "Conscious Family Centre", url: siteUrl },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Programs", item: `${siteUrl}/programs` },
      { "@type": "ListItem", position: 2, name: program.title, item: `${siteUrl}/programs/${program.slug}` },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: program.faqs
      .filter((f) => typeof f.answer === "string")
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer as string },
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(programSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqSchema.mainEntity.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <ProgramHero
        title={program.title}
        intro={program.summary}
        image={program.heroImage}
        back={{ href: "/programs", label: "All programs" }}
        ctas={[program.cta ?? { label: "Book a Visit", href: "/contact" }]}
      />

      {/* Description + quick facts */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <Reveal>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {program.ageBands.map((band) => (
                <Tag key={band} tone="sage">
                  {AGE_BANDS[band]?.label ?? band}
                </Tag>
              ))}
            </div>

            {program.learningExperience && (
              <p className="text-xl leading-relaxed text-bark-700/90">{program.learningExperience}</p>
            )}

            {program.keyBenefits.length > 0 && (
              <div className="mt-8">
                <h2 className="text-display-sm text-forest-900">Key benefits</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {program.keyBenefits.map((b) => (
                    <li key={b} className="flex gap-2 text-bark-700/85">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {program.typicalActivities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-display-sm text-forest-900">Typical activities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {program.typicalActivities.map((a) => (
                    <Tag key={a} tone="leaf">
                      {a}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {program.dayInTheLife.length > 0 && (
              <div className="mt-10">
                <h2 className="text-display-sm text-forest-900">A day in the life</h2>
                <div className="mt-6">
                  <ProgramTimeline items={program.dayInTheLife} />
                </div>
              </div>
            )}
          </Reveal>

          {/* Quick facts sidebar */}
          <Reveal delay={0.05}>
            <aside className="rounded-card-lg border border-forest-700/10 bg-white p-7 shadow-soft lg:sticky lg:top-28">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-bark-700/60">At a glance</h2>
              <dl className="mt-4 space-y-4">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-bark-700/50">{f.label}</dt>
                    <dd className="mt-0.5 text-forest-900">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {program.pricing.length > 0 && (
                <div className="mt-6 border-t border-forest-700/10 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-bark-700/50">Pricing</h3>
                  <ul className="mt-3 space-y-2">
                    {program.pricing.map((tier) => (
                      <li key={tier.label} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-bark-700/80">{tier.label}</span>
                        <span className="font-semibold text-forest-900">
                          {formatNaira(tier.amount)}
                          <span className="font-normal text-bark-700/60">/{tier.unit}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.whatToBring.length > 0 && (
                <div className="mt-6 border-t border-forest-700/10 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-bark-700/50">What to bring</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-bark-700/80">
                    {program.whatToBring.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </Reveal>
        </div>
      </Section>

      {galleryItems.length > 0 && (
        <ProgramGallery
          content={{ eyebrow: "Gallery", heading: `Life in ${program.title}` }}
          items={galleryItems}
        />
      )}

      <ProgramFaqSection eyebrow="Good to know" heading="Questions, answered." faqs={program.faqs} />

      <ProgramTestimonials eyebrow="Loved by our families" heading="What parents say." testimonials={testimonials} />

      <ProgramCTA
        eyebrow="Take the next step"
        heading={`Ready to explore ${program.title}?`}
        body="Book a visit to see the centre, or get in touch — we'd love to help you find the right fit."
        ctas={[
          { label: "Book a Visit", href: "/contact" },
          { label: "Contact Us", href: "/contact" },
          { label: "Register for Summer Camp", href: "/camp-registration" },
        ]}
      />
    </>
  );
}
