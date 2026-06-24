import type { Metadata } from "next";
import { getAboutContent, getSiteSettings, getTeam, getTestimonials } from "@/lib/data";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import MissionSection from "@/components/about/MissionSection";
import VisionSection from "@/components/about/VisionSection";
import Philosophy from "@/components/about/Philosophy";
import Differentiators from "@/components/about/Differentiators";
import LearningEnvironment from "@/components/about/LearningEnvironment";
import MeetTheTeam from "@/components/about/MeetTheTeam";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import CommunityStatement from "@/components/about/CommunityStatement";
import Community from "@/components/about/Community";
import VisitUs from "@/components/about/VisitUs";
import StatsSection from "@/components/shared/StatsSection";
import FinalCta from "@/components/home/FinalCta";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

const IMPACT_STATS = [
  { value: 200, suffix: "+", label: "Families Served" },
  { value: 4, suffix: "+", label: "Core Programs" },
  { value: 3, suffix: "+", label: "Years of Nurturing" },
  { value: 6, suffix: "+", label: "Days a Week" },
];

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/about" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/about`,
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function AboutPage() {
  const [about, settings, team, testimonials] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
    getTeam(),
    getTestimonials(),
  ]);

  // JSON-LD Organization schema, built from CMS-managed site settings.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "ChildCare"],
    name: settings.siteName,
    description: about.hero.mission,
    url: siteUrl,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.line,
      addressLocality: settings.address.area,
      addressRegion: settings.address.city,
      addressCountry: "NG",
    },
    sameAs: Object.values(settings.socials).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <AboutHero hero={about.hero} />

      <div id="our-story" className="scroll-mt-24">
        <OurStory story={about.story} />
      </div>

      <div id="mission" className="scroll-mt-24">
        <MissionSection statement={about.hero.mission} />
      </div>

      <div id="vision" className="scroll-mt-24">
        <VisionSection
          statement={about.story.pullQuote ?? about.hero.mission}
          image={about.environment.images[0] ?? about.community.image}
        />
      </div>

      <StatsSection eyebrow="By the numbers" heading="Our impact so far." stats={IMPACT_STATS} tone="sage" />

      <Philosophy philosophy={about.philosophy} />
      <Differentiators differentiators={about.differentiators} />

      <div id="environment" className="scroll-mt-24">
        <LearningEnvironment environment={about.environment} />
      </div>

      <div id="team" className="scroll-mt-24">
        <MeetTheTeam content={about.team} team={team} />
      </div>

      <AboutTestimonials content={about.testimonials} testimonials={testimonials} />

      <div id="community" className="scroll-mt-24">
        <CommunityStatement />
        <Community community={about.community} />
      </div>

      <div id="visit" className="scroll-mt-24">
        <VisitUs settings={settings} image={about.community.image} />
      </div>

      <FinalCta content={about.finalCta} />
    </>
  );
}
