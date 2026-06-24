import { defineArrayMember, defineField, defineType } from "sanity";

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" });
const heading = defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", title: "Introduction Text", type: "text", rows: 2 });

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    section("hero", "Hero Banner", [
      eyebrow,
      defineField({ name: "title", title: "Main Headline", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "intro", title: "Introduction Text", type: "text", rows: 3 }),
      defineField({ name: "image", title: "Background Image", type: "imageWithAlt" }),
    ]),
    section("welcome", "Welcome Message", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", title: "Text Paragraphs", type: "array", of: [{ type: "text" }] }),
    ]),
    section("form", "Inquiry Form", [eyebrow, heading, intro]),
    section("visit", "Book a Visit", [
      eyebrow,
      heading,
      defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "benefits", title: "What You'll See", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "cta", title: "Button", type: "cta" }),
    ]),
    section("journey", "Getting Started", [
      eyebrow,
      heading,
      intro,
      defineField({
        name: "steps",
        title: "Steps",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", title: "Step Title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            ],
            preview: { select: { title: "title" } },
          }),
        ],
        validation: (r) => r.min(2).max(6),
      }),
    ]),
    section("camp", "Camp Promotion", [
      eyebrow,
      heading,
      defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "availabilityNote", title: "Availability Note", type: "string" }),
      defineField({ name: "cta", title: "Button", type: "cta" }),
    ]),
    section("faq", "FAQ Preview", [eyebrow, heading]),
    section("finalCta", "Final Call to Action", [
      eyebrow,
      heading,
      defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
