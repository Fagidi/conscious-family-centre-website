import { defineField, defineType } from "sanity";

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", title: "Section Label", type: "string", description: "Small text displayed above the heading" });
const heading = defineField({ name: "heading", title: "Heading", type: "string" });
const intro = defineField({ name: "intro", title: "Introduction Text", type: "text", rows: 2 });

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Gallery Page",
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
    section("intro", "Visual Story Introduction", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", title: "Text Paragraphs", type: "array", of: [{ type: "text" }] }),
    ]),
    section("gallery", "Gallery Section", [eyebrow, heading, intro]),
    section("featuredMoments", "Featured Moments", [eyebrow, heading, intro]),
    section("community", "Community Highlight", [
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
  preview: { prepare: () => ({ title: "Gallery Page" }) },
});
