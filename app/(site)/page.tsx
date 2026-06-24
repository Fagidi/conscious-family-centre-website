import type { Metadata } from "next";
import {
  getHomeContent,
  getFeaturedPrograms,
  getCamps,
  getTestimonials,
  getGallery,
  getFaqs,
} from "@/lib/data";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AboutPreview from "@/components/home/AboutPreview";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import CampFeature from "@/components/home/CampFeature";
import GalleryPreview from "@/components/home/GalleryPreview";
import Testimonials from "@/components/home/Testimonials";
import FaqPreview from "@/components/home/FaqPreview";
import FinalCta from "@/components/home/FinalCta";
import StatsSection from "@/components/shared/StatsSection";
import HomeSecondaryNav from "@/components/home/HomeSecondaryNav";

const HOME_SECTIONS = [
  { id: "about", label: "About" },
  { id: "programs", label: "Programs" },
  { id: "community", label: "Community" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

// Impact numbers (provided content) — shared with the About page.
const IMPACT_STATS = [
  { value: 200, suffix: "+", label: "Families Served" },
  { value: 4, suffix: "+", label: "Core Programs" },
  { value: 3, suffix: "+", label: "Years of Nurturing" },
  { value: 6, suffix: "+", label: "Days a Week" },
];

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  // `absolute` bypasses the "%s | Conscious Family Centre" template (the home
  // title already carries the brand) to avoid double-branding.
  return { title: { absolute: seo.title }, description: seo.description };
}

export default async function HomePage() {
  const [home, programs, camps, testimonials, gallery, faqs] = await Promise.all([
    getHomeContent(),
    getFeaturedPrograms(4),
    getCamps(),
    getTestimonials(),
    getGallery(),
    getFaqs("general"),
  ]);

  const featuredCamp = camps.find((c) => c.status === "open") ?? camps[0] ?? null;

  return (
    <>
      <Hero hero={home.hero} />
      <HomeSecondaryNav items={HOME_SECTIONS} />
      <WhyChooseUs content={home.why} />
      <div id="about" className="scroll-mt-28">
        <AboutPreview content={home.about} />
      </div>
      <StatsSection eyebrow="Our impact" heading="Growing, together." stats={IMPACT_STATS} tone="forest" />
      <div id="programs" className="scroll-mt-28">
        <ProgramsPreview content={home.programs} programs={programs} />
      </div>
      <CampFeature content={home.camp} camp={featuredCamp} />
      <div id="gallery" className="scroll-mt-28">
        <GalleryPreview content={home.gallery} items={gallery} />
      </div>
      <div id="community" className="scroll-mt-28">
        <Testimonials content={home.testimonials} testimonials={testimonials} />
      </div>
      <div id="faq" className="scroll-mt-28">
        <FaqPreview content={home.faq} faqs={faqs} />
      </div>
      <div id="contact" className="scroll-mt-28">
        <FinalCta content={home.finalCta} />
      </div>
    </>
  );
}
