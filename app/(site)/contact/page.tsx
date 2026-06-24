import type { Metadata } from "next";
import { getContactPageContent, getSiteSettings, getCamps, getFaqs } from "@/lib/data";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import FaqPageAccordion from "@/components/faq/FaqPageAccordion";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import InquiryForm from "@/components/contact/InquiryForm";
import VisitSection from "@/components/contact/VisitSection";
import MapSection from "@/components/contact/MapSection";
import JourneyTimeline from "@/components/contact/JourneyTimeline";
import CampPromotion from "@/components/contact/CampPromotion";
import ContactCTA from "@/components/contact/ContactCTA";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPageContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/contact`,
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function ContactPage() {
  const [content, settings, camps, faqs] = await Promise.all([
    getContactPageContent(),
    getSiteSettings(),
    getCamps(),
    getFaqs("general"),
  ]);

  const featuredCamp = camps.find((c) => c.status === "open") ?? camps[0] ?? null;
  const faqPreview = faqs.slice(0, 6);

  // JSON-LD: ContactPage + Organization with contact details (from settings).
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: settings.siteName,
    url: siteUrl,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.line,
      addressLocality: settings.address.area,
      addressRegion: settings.address.city,
      addressCountry: "NG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      email: settings.email,
      contactType: "customer service",
    },
  };
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: content.seo.title,
    description: content.seo.description,
    url: `${siteUrl}/contact`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />

      <ContactHero hero={content.hero} />

      {/* Welcome */}
      <Section tone="cream" spacing="lg" width="prose">
        <Reveal className="text-center">
          <p className="eyebrow mb-3">{content.welcome.eyebrow}</p>
          <h2 className="text-display-md">{content.welcome.heading}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-bark-700/85">
            {content.welcome.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Contact info + inquiry form */}
      <Section tone="sage" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Reach us directly" title="Our details." className="mb-8" />
            <ContactInfo settings={settings} />
          </div>

          <Reveal>
            <div className="rounded-card-lg border border-forest-700/10 bg-white p-6 shadow-soft md:p-8">
              {content.form.eyebrow && <p className="eyebrow mb-3">{content.form.eyebrow}</p>}
              <h2 className="text-display-sm text-forest-900">{content.form.heading}</h2>
              {content.form.intro && <p className="mt-2 text-bark-700/80">{content.form.intro}</p>}
              <div className="mt-6">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <VisitSection visit={content.visit} />
      <MapSection settings={settings} />
      <JourneyTimeline journey={content.journey} />
      <CampPromotion content={content.camp} camp={featuredCamp} />

      {/* FAQ preview */}
      {faqPreview.length > 0 && (
        <Section tone="cream" spacing="lg">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow={content.faq.eyebrow} title={content.faq.heading} />
              <div className="mt-6">
                <Button href="/faq" variant="ghost">
                  View all FAQs
                </Button>
              </div>
            </div>
            <Reveal delay={0.05}>
              <FaqPageAccordion items={faqPreview} idPrefix="contact-faq" />
            </Reveal>
          </div>
        </Section>
      )}

      <ContactCTA content={content.finalCta} />
    </>
  );
}
