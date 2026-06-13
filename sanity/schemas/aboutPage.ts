import { defineField, defineType } from "sanity";
import { seoField, sectionHeadingField } from "./fields";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  description: "Story, standards, and closing sections. The hero lives under Hero Content.",
  fields: [
    defineField({
      name: "story",
      title: "Story",
      type: "object",
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
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [{ type: "text", rows: 5 }],
          validation: (rule) => rule.min(1).max(4),
        }),
        defineField({ name: "image", title: "Primary Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Primary Image Alt Text", type: "string" }),
        defineField({ name: "secondImage", title: "Offset Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "secondImageAlt", title: "Offset Image Alt Text", type: "string" }),
      ],
    }),
    sectionHeadingField("pillarsSection", "Standards Section Heading"),
    defineField({
      name: "pillars",
      title: "Standards (Pillars)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "closing",
      title: "Closing (The People)",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "titleLines",
          title: "Headline Lines",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.min(1).max(3),
        }),
        defineField({ name: "body", title: "Body Copy", type: "text", rows: 4 }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
