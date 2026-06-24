import { defineArrayMember, defineField, defineType } from "sanity";

const iconOptions = [
  { title: "Leaf", value: "leaf" },
  { title: "Sprout", value: "sprout" },
  { title: "Sun", value: "sun" },
  { title: "Compass", value: "compass" },
];

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Banner",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" }),
    defineField({ name: "headline", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subhead", title: "Subheading", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Background Image", type: "imageWithAlt" }),
    defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(2) }),
  ],
  preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: `Hero Banner — ${title}` }) },
});

export const pillarsSection = defineType({
  name: "pillarsSection",
  title: "Value Highlights",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "pillars",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: iconOptions } }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Value Highlights" }) },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics",
  type: "object",
  fields: [
    defineField({
      name: "stats",
      title: "Numbers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Number", type: "number", validation: (r) => r.required() }),
            defineField({ name: "suffix", title: "Symbol After Number", type: "string", description: "e.g. + or %" }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { value: "value", label: "label" }, prepare: ({ value, label }) => ({ title: `${value} ${label}` }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Statistics" }) },
});

export const splitFeature = defineType({
  name: "splitFeature",
  title: "Image & Text",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({
      name: "imageSide",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left side", value: "left" },
          { title: "Right side", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
    defineField({ name: "cta", title: "Button", type: "cta" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Image & Text — ${title}` }) },
});

export const ctaBand = defineType({
  name: "ctaBand",
  title: "Call to Action Banner",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "cta", title: "Button", type: "cta", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Background Image", type: "imageWithAlt" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Action Banner — ${title}` }) },
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Photo Gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "items", title: "Photos", type: "array", of: [{ type: "imageWithAlt" }] }),
  ],
  preview: { prepare: () => ({ title: "Photo Gallery" }) },
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "testimonials", title: "Selected Testimonials", type: "array", of: [{ type: "reference", to: [{ type: "testimonial" }] }] }),
  ],
  preview: { prepare: () => ({ title: "Testimonials" }) },
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "category",
      title: "Show Questions About",
      type: "string",
      options: {
        list: [
          { title: "Camps", value: "camps" },
          { title: "Membership", value: "membership" },
          { title: "General", value: "general" },
        ],
      },
    }),
    defineField({ name: "faqs", title: "Selected Questions", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
  ],
  preview: { prepare: () => ({ title: "FAQ" }) },
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
