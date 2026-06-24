import type { Metadata } from "next";
import {
  getProgramsPageContent,
  getProgramShowcase,
  getGallery,
  getFaqs,
  getTestimonials,
} from "@/lib/data";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramOverview from "@/components/programs/ProgramOverview";
import ProgramNavigation from "@/components/programs/ProgramNavigation";
import ProgramFeatureBlock from "@/components/programs/ProgramFeatureBlock";
import ProgramOutcomes from "@/components/programs/ProgramOutcomes";
import LearningThroughExperience from "@/components/programs/LearningThroughExperience";
import ProgramGallery from "@/components/programs/ProgramGallery";
import ProgramFaqSection from "@/components/programs/ProgramFaqSection";
import ProgramTestimonials from "@/components/programs/ProgramTestimonials";
import FinalCta from "@/components/home/FinalCta";

// Incrementally re-validate so published CMS edits appear without a redeploy.
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getProgramsPageContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/programs" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/programs`,
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function ProgramsPage() {
  const [content, programs, gallery, faqs, testimonials] = await Promise.all([
    getProgramsPageContent(),
    getProgramShowcase(),
    getGallery(),
    getFaqs("programs"),
    getTestimonials(),
  ]);

  const navItems = programs.map((p) => ({ id: `program-${p.slug}`, label: p.title }));

  // JSON-LD: a list of programs (ItemList) + an FAQPage from the program FAQs.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${siteUrl}/programs/${p.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => typeof f.answer === "string")
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer as string },
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      {faqSchema.mainEntity.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <ProgramHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
        image={content.hero.image}
        ctas={[content.hero.primaryCta, content.hero.secondaryCta]}
      />

      <ProgramOverview overview={content.overview} />

      {navItems.length > 1 && <ProgramNavigation items={navItems} />}

      {programs.map((program, i) => (
        <ProgramFeatureBlock key={program.slug} program={program} index={i} id={`program-${program.slug}`} />
      ))}

      <ProgramOutcomes outcomes={content.outcomes} />
      <LearningThroughExperience experience={content.experience} />
      <ProgramGallery content={content.gallery} items={gallery} />
      <ProgramFaqSection
        eyebrow={content.faq.eyebrow}
        heading={content.faq.heading}
        faqs={faqs}
        cta={{ label: "View All FAQs", href: "/faq" }}
      />
      <ProgramTestimonials
        eyebrow={content.testimonials.eyebrow}
        heading={content.testimonials.heading}
        testimonials={testimonials}
      />
      <FinalCta content={content.finalCta} />
    </>
  );
}
