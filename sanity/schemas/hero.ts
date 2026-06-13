import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero Content",
  type: "document",
  description: "Hero sections for each page. One document per page.",
  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "About", value: "about" },
          { title: "Services", value: "services" },
          { title: "FAQ", value: "faq" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "titleLines",
      title: "Headline Lines",
      description: "Each entry renders as its own line of the headline.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1).max(3),
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "Primary CTA Label", type: "string" }),
    defineField({ name: "ctaHref", title: "Primary CTA Link", type: "string" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
    defineField({ name: "secondaryCtaHref", title: "Secondary CTA Link", type: "string" }),
    defineField({ name: "image", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
  ],
  preview: {
    select: { title: "page", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({ title: `Hero — ${title ?? "untitled"}`, subtitle }),
  },
});
