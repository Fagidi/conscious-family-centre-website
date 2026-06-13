import { defineField, defineType } from "sanity";
import { seoField, sectionHeadingField } from "./fields";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  description:
    "Editorial sections of the home page. The hero lives under Hero Content; services, gallery, and testimonials pull from their own collections.",
  fields: [
    defineField({
      name: "manifesto",
      title: "Manifesto",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "lines",
          title: "Statement Lines",
          description: "Each entry renders as its own line of the statement.",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.min(1).max(4),
        }),
        defineField({ name: "body", title: "Supporting Copy", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    sectionHeadingField("servicesSection", "Services Section Heading"),
    defineField({
      name: "gallerySection",
      title: "Gallery Section Heading",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
      ],
    }),
    defineField({ name: "testimonialsEyebrow", title: "Testimonials Eyebrow", type: "string" }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
