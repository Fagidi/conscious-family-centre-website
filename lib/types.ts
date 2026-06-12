/**
 * Shared content types.
 *
 * Every type here is the contract between the Sanity schemas
 * (sanity/schemas/*) and the curated fallback content (lib/content.ts).
 * Pages consume these via lib/data.ts and never care which source won.
 */

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  serviceArea: string;
  instagram: string;
  bookingCtaLabel: string;
  announcement?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords: string[];
}

export interface HeroContent {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image: string;
  imageAlt: string;
}

export interface Service {
  slug: string;
  eyebrow: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  event: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ValuePillar {
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}
