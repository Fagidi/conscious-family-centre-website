import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Closing CTA (all pages)",
  type: "document",
  description: "The full-bleed closing invitation rendered at the bottom of every page.",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "titleLines",
      title: "Headline Lines",
      description: "Each entry renders as its own line of the headline.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1).max(3),
    }),
    defineField({ name: "body", title: "Body Copy", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({
      name: "ctaHref",
      title: "CTA Link",
      type: "string",
      initialValue: "/contact",
    }),
    defineField({ name: "image", title: "Background Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Closing CTA" }) },
});
