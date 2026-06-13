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
  /** Footer invitation headline, one entry per display line. */
  footerInvitationLines: string[];
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords: string[];
}

/** Per-page <title> + meta description, editable on each page document. */
export interface PageSeo {
  title: string;
  description: string;
}

/** Eyebrow + masked-line headline lockup used to open sections. */
export interface SectionHeadingContent {
  eyebrow: string;
  titleLines: string[];
}

export interface HeroContent {
  eyebrow: string;
  titleLines: string[];
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  imageAlt?: string;
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

/* ───────────── Page documents (one singleton per page) ───────────── */

export interface HomePageContent {
  manifesto: {
    eyebrow: string;
    lines: string[];
    body: string;
  };
  stats: Stat[];
  servicesSection: SectionHeadingContent;
  gallerySection: { eyebrow: string; title: string };
  testimonialsEyebrow: string;
  seo: PageSeo;
}

export interface AboutPageContent {
  story: {
    eyebrow: string;
    titleLines: string[];
    paragraphs: string[];
    image: string;
    imageAlt: string;
    secondImage: string;
    secondImageAlt: string;
  };
  pillarsSection: SectionHeadingContent;
  pillars: ValuePillar[];
  closing: {
    eyebrow: string;
    titleLines: string[];
    body: string;
  };
  seo: PageSeo;
}

export interface ServicesPageContent {
  processSection: SectionHeadingContent;
  processSteps: ProcessStep[];
  seo: PageSeo;
}

export interface FaqPageContent {
  sideNote: {
    eyebrow: string;
    title: string;
    ctaLabel: string;
  };
  seo: PageSeo;
}

export interface ContactContent {
  eyebrow: string;
  titleLines: string[];
  body: string;
  image: string;
  imageAlt: string;
  eventTypes: string[];
  seo: PageSeo;
}

/** Shared full-bleed closing invitation rendered on every page. */
export interface CtaContent {
  eyebrow: string;
  titleLines: string[];
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}
