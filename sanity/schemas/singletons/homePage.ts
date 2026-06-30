import { defineArrayMember, defineField, defineType } from "sanity";

const iconOptions = [
  { title: "Leaf", value: "leaf" },
  { title: "Sprout", value: "sprout" },
  { title: "Sun", value: "sun" },
  { title: "Compass", value: "compass" },
];

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" });
const heading = defineField({ name: "heading", title: "Heading", type: "string" });
const intro = defineField({ name: "intro", title: "Introduction Text", type: "text", rows: 2 });

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    section("hero", "Hero Banner", [
      eyebrow,
      defineField({ name: "headline", title: "Main Headline", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "subhead", title: "Subheading", type: "text", rows: 2 }),
      defineField({ name: "image", title: "Background Image", type: "imageWithAlt" }),
      defineField({ name: "primaryCta", title: "Primary Button", type: "cta" }),
      defineField({ name: "secondaryCta", title: "Secondary Button", type: "cta" }),
      defineField({ name: "tertiaryCta", title: "Third Button", type: "cta" }),
    ]),
    section("why", "Why Families Choose Us", [
      eyebrow,
      heading,
      intro,
      defineField({
        name: "pillars",
        title: "Key Reasons",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              defineField({ name: "icon", title: "Icon", type: "string", options: { list: iconOptions } }),
            ],
            preview: { select: { title: "title" } },
          }),
        ],
        validation: (r) => r.max(4),
      }),
    ]),
    section("about", "About Preview", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", title: "Text Paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
      defineField({ name: "cta", title: "Button", type: "cta" }),
    ]),
    section("programs", "Programs Preview", [eyebrow, heading, intro, defineField({ name: "cta", title: "Button", type: "cta" })]),
    section("camp", "Summer Camp Feature", [eyebrow, heading, intro]),
    section("gallery", "Gallery Preview", [eyebrow, heading, intro, defineField({ name: "cta", title: "Button", type: "cta" })]),
    section("testimonials", "Testimonials", [eyebrow, heading]),
    section("faq", "FAQ Preview", [eyebrow, heading, defineField({ name: "cta", title: "Button", type: "cta" })]),
    section("finalCta", "Final Call to Action", [
      eyebrow,
      heading,
      defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
