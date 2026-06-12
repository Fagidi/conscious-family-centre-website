import { groq } from "next-sanity";

/**
 * GROQ queries.
 *
 * Every projection is shaped to the exact types in lib/types.ts so that
 * Sanity documents and fallback content are interchangeable. Images are
 * resolved to direct CDN URLs in the query.
 */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName, tagline, phone, email, location, serviceArea,
    instagram, bookingCtaLabel, announcement
  }
`;

export const seoSettingsQuery = groq`
  *[_type == "seoSettings"][0]{
    metaTitle, metaDescription,
    "ogImage": ogImage.asset->url,
    keywords
  }
`;

export const heroQuery = groq`
  *[_type == "hero" && page == $page][0]{
    eyebrow, titleLines, subtitle,
    ctaLabel, ctaHref, secondaryCtaLabel, secondaryCtaHref,
    "image": image.asset->url,
    imageAlt
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc){
    "slug": slug.current,
    eyebrow, title, shortDescription, description, features,
    "image": image.asset->url,
    imageAlt
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc){
    quote, author, event
  }
`;

export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc){
    "src": image.asset->url,
    alt, caption
  }
`;

export const faqQuery = groq`
  *[_type == "faqItem"] | order(order asc){
    question, answer, category
  }
`;

export const contactInfoQuery = groq`
  *[_type == "contactInfo"][0]{
    eyebrow, titleLines, body,
    "image": image.asset->url,
    imageAlt, eventTypes
  }
`;
