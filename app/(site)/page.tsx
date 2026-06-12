import type { Metadata } from "next";
import { getHomeHero, getServices, getGallery, getTestimonials } from "@/lib/data";
import { pageSeo } from "@/lib/content";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import ServicesPreview from "@/components/home/ServicesPreview";
import GalleryStrip from "@/components/home/GalleryStrip";
import Testimonials from "@/components/home/Testimonials";
import CtaSection from "@/components/shared/CtaSection";

export const metadata: Metadata = {
  title: { absolute: pageSeo.home.title },
  description: pageSeo.home.description,
};

export default async function HomePage() {
  const [hero, services, gallery, testimonials] = await Promise.all([
    getHomeHero(),
    getServices(),
    getGallery(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero content={hero} />
      <Manifesto />
      <ServicesPreview services={services} />
      <GalleryStrip images={gallery} />
      <Testimonials items={testimonials} />
      <CtaSection />
    </>
  );
}
