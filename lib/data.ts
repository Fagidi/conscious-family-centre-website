import { fetchWithFallback } from "./sanity/client";
import {
  siteSettingsQuery,
  seoSettingsQuery,
  heroQuery,
  homePageQuery,
  aboutPageQuery,
  servicesPageQuery,
  faqPageQuery,
  servicesQuery,
  testimonialsQuery,
  galleryQuery,
  faqQuery,
  contactInfoQuery,
  ctaSectionQuery,
} from "./sanity/queries";
import * as fallback from "./content";
import type {
  SiteSettings,
  SeoSettings,
  HeroContent,
  HomePageContent,
  AboutPageContent,
  ServicesPageContent,
  FaqPageContent,
  ContactContent,
  CtaContent,
  Service,
  Testimonial,
  GalleryImage,
  FaqItem,
} from "./types";

/**
 * Data access layer. Pages call these getters and never know whether
 * the content came from Sanity or the curated defaults — missing
 * documents and missing fields both resolve to lib/content.ts.
 */

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchWithFallback(siteSettingsQuery, fallback.siteSettings);
}

export function getSeoSettings(): Promise<SeoSettings> {
  return fetchWithFallback(seoSettingsQuery, fallback.seoSettings);
}

export function getHero(page: keyof typeof fallback.heroes): Promise<HeroContent> {
  return fetchWithFallback(heroQuery, fallback.heroes[page], { page });
}

export function getHomePage(): Promise<HomePageContent> {
  return fetchWithFallback(homePageQuery, fallback.homePage);
}

export function getAboutPage(): Promise<AboutPageContent> {
  return fetchWithFallback(aboutPageQuery, fallback.aboutPage);
}

export function getServicesPage(): Promise<ServicesPageContent> {
  return fetchWithFallback(servicesPageQuery, fallback.servicesPage);
}

export function getFaqPage(): Promise<FaqPageContent> {
  return fetchWithFallback(faqPageQuery, fallback.faqPage);
}

export function getServices(): Promise<Service[]> {
  return fetchWithFallback(servicesQuery, fallback.services);
}

export function getTestimonials(): Promise<Testimonial[]> {
  return fetchWithFallback(testimonialsQuery, fallback.testimonials);
}

export function getGallery(): Promise<GalleryImage[]> {
  return fetchWithFallback(galleryQuery, fallback.galleryImages);
}

export function getFaqItems(): Promise<FaqItem[]> {
  return fetchWithFallback(faqQuery, fallback.faqItems);
}

export function getContactContent(): Promise<ContactContent> {
  return fetchWithFallback(contactInfoQuery, fallback.contactContent);
}

export function getCtaSection(): Promise<CtaContent> {
  return fetchWithFallback(ctaSectionQuery, fallback.ctaSection);
}
