import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: 'Small label above the title, e.g. "01 — The Signature Booth".',
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({ name: "shortDescription", title: "Short Description", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Full Description", type: "text", rows: 5 }),
    defineField({
      name: "features",
      title: "What's Included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "eyebrow", media: "image" } },
});
