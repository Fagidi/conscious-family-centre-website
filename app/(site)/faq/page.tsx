import type { Metadata } from "next";
import { getFaqPageContent, getAllFaqs, getFaqCategories, getFaqs } from "@/lib/data";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import FaqExperience from "@/components/faq/FaqExperience";
import FaqPageAccordion from "@/components/faq/FaqPageAccordion";
import FAQCTA from "@/components/faq/FAQCTA";

// ISR so published CMS FAQ edits appear without a redeploy.
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFaqPageContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/faq" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/faq`,
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function FaqPage() {
  const [content, items, categories, campFaqs] = await Promise.all([
    getFaqPageContent(),
    getAllFaqs(),
    getFaqCategories(),
    getFaqs("camps"),
  ]);

  // FAQPage JSON-LD from all string-answer questions (rich results / SEO).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((f) => typeof f.answer === "string")
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer as string },
      })),
  };

  return (
    <>
      {faqSchema.mainEntity.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <FaqExperience content={content} items={items} categories={categories} />

      {campFaqs.length > 0 && (
        <Section tone="sage" spacing="lg">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Camps"
              title="Camp registration questions."
              intro="Everything about our holiday camp and how to register."
            />
            <Reveal delay={0.05}>
              <FaqPageAccordion items={campFaqs} idPrefix="camp" />
            </Reveal>
          </div>
        </Section>
      )}

      <FAQCTA
        eyebrow={content.support.eyebrow}
        heading={content.support.heading}
        body={content.support.body}
        ctas={content.support.ctas}
        variant="support"
      />

      <FAQCTA
        eyebrow={content.finalCta.eyebrow}
        heading={content.finalCta.heading}
        body={content.finalCta.body}
        ctas={content.finalCta.ctas}
        variant="final"
      />
    </>
  );
}
