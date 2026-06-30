import { defineField, defineType } from "sanity";

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" });
const heading = defineField({ name: "heading", title: "Heading", type: "string" });
const intro = defineField({ name: "intro", title: "Introduction Text", type: "text", rows: 2 });

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
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
    section("featured", "Featured Questions", [eyebrow, heading, intro]),
    section("browse", "Browse / Search", [eyebrow, heading, intro]),
    section("support", "Still Have Questions?", [
      eyebrow,
      heading,
      defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    section("finalCta", "Final Call to Action", [
      eyebrow,
      heading,
      defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
      defineField({ name: "ctas", title: "Buttons", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "FAQ Page" }) },
});
