import { fetchWithFallback } from "./sanity/client";
import {
  siteSettingsQuery,
  seoSettingsQuery,
  heroQuery,
  servicesQuery,
  testimonialsQuery,
  galleryQuery,
  faqQuery,
  contactInfoQuery,
} from "./sanity/queries";
import * as fallback from "./content";
import type {
  SiteSettings,
  SeoSettings,
  HeroContent,
  Service,
  Testimonial,
  GalleryImage,
  FaqItem,
} from "./types";

/**
 * Data access layer. Pages call these getters and never know whether
 * the content came from Sanity or the curated defaults.
 */

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchWithFallback(siteSettingsQuery, fallback.siteSettings);
}

export function getSeoSettings(): Promise<SeoSettings> {
  return fetchWithFallback(seoSettingsQuery, fallback.seoSettings);
}

export function getHomeHero(): Promise<HeroContent> {
  return fetchWithFallback(heroQuery, fallback.homeHero, { page: "home" });
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

export function getContactContent(): Promise<typeof fallback.contactContent> {
  return fetchWithFallback(contactInfoQuery, fallback.contactContent);
}
