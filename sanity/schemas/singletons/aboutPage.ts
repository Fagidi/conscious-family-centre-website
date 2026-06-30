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

const cardArray = (name: string) =>
  defineField({
    name,
    title: "Items",
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
    validation: (r) => r.max(6),
  });

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Us",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    section("hero", "Hero Banner", [
      eyebrow,
      defineField({ name: "title", title: "Main Headline", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "mission", title: "Mission Statement", type: "text", rows: 3 }),
      defineField({ name: "image", title: "Background Image", type: "imageWithAlt" }),
    ]),
    section("story", "Our Story", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", title: "Text Paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
      defineField({ name: "pullQuote", title: "Highlighted Quote", type: "text", rows: 2 }),
    ]),
    section("philosophy", "Our Philosophy", [eyebrow, heading, intro, cardArray("cards")]),
    section("differentiators", "What Makes Us Different", [eyebrow, heading, intro, cardArray("items")]),
    section("environment", "Learning Environment", [
      eyebrow,
      heading,
      intro,
      defineField({ name: "images", title: "Photos", type: "array", of: [{ type: "imageWithAlt" }], validation: (r) => r.max(8) }),
    ]),
    section("team", "Meet the Team", [eyebrow, heading, intro]),
    section("testimonials", "Parent Testimonials", [eyebrow, heading]),
    section("community", "Community", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", title: "Text Paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    ]),
    section("finalCta", "Final Call to Action", [
      eyebrow,
      heading,
      defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About Us" }) },
});
