import type { Metadata } from "next";
import {
  getHero,
  getHomePage,
  getServices,
  getGallery,
  getTestimonials,
} from "@/lib/data";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import ServicesPreview from "@/components/home/ServicesPreview";
import GalleryStrip from "@/components/home/GalleryStrip";
import Testimonials from "@/components/home/Testimonials";
import CtaSection from "@/components/shared/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return { title: { absolute: seo.title }, description: seo.description };
}

export default async function HomePage() {
  const [hero, page, services, gallery, testimonials] = await Promise.all([
    getHero("home"),
    getHomePage(),
    getServices(),
    getGallery(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero content={hero} />
      <Manifesto manifesto={page.manifesto} stats={page.stats} />
      <ServicesPreview services={services} heading={page.servicesSection} />
      <GalleryStrip images={gallery} heading={page.gallerySection} />
      <Testimonials items={testimonials} eyebrow={page.testimonialsEyebrow} />
      <CtaSection />
    </>
  );
}
