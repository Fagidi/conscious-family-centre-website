import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Page-builder sections. The `page` document composes these in any order
 * so editors build marketing pages (Home, Why CFC…) without dev work.
 * Each maps 1:1 to a member of the PageSection union in lib/types.ts and
 * is projected by pageBySlugQuery.
 */

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subhead", type: "text", rows: 2 }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(2) }),
  ],
  preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: `Hero — ${title}` }) },
});

export const pillarsSection = defineType({
  name: "pillarsSection",
  title: "Value pillars",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "pillars",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({ name: "icon", type: "string", description: "Icon key (leaf, sprout, sun…)" }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Value pillars" }) },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats",
  type: "object",
  fields: [
    defineField({
      name: "stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "number", validation: (r) => r.required() }),
            defineField({ name: "suffix", type: "string", description: "e.g. + or %" }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { value: "value", label: "label" }, prepare: ({ value, label }) => ({ title: `${value} ${label}` }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stats band" }) },
});

export const splitFeature = defineType({
  name: "splitFeature",
  title: "Split feature",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({ name: "imageSide", type: "string", options: { list: ["left", "right"], layout: "radio" }, initialValue: "right" }),
    defineField({ name: "cta", type: "cta" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Split — ${title}` }) },
});

export const ctaBand = defineType({
  name: "ctaBand",
  title: "CTA band",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 2 }),
    defineField({ name: "cta", type: "cta", validation: (r) => r.required() }),
    defineField({ name: "image", type: "imageWithAlt" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `CTA — ${title}` }) },
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "items", type: "array", of: [{ type: "imageWithAlt" }] }),
  ],
  preview: { prepare: () => ({ title: "Gallery section" }) },
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "testimonials", type: "array", of: [{ type: "reference", to: [{ type: "testimonial" }] }] }),
  ],
  preview: { prepare: () => ({ title: "Testimonials section" }) },
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "category", type: "string", options: { list: ["camps", "membership", "general"] } }),
    defineField({ name: "faqs", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
  ],
  preview: { prepare: () => ({ title: "FAQ section" }) },
});

export const sectionObjects = [
  heroSection,
  pillarsSection,
  statsSection,
  splitFeature,
  ctaBand,
  gallerySection,
  testimonialsSection,
  faqSection,
];
