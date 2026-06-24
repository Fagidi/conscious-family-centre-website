import { defineField, defineType } from "sanity";

/**
 * Gallery Page — a singleton holding the framing copy + hero media for the
 * Gallery experience. Images come from `galleryItem`, categories from
 * `galleryCategory`, and immersive stories from `featuredStory`. Mirrors the
 * homePage / aboutPage / programsPage singleton pattern.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Gallery Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    section("hero", "Hero", [
      eyebrow,
      defineField({ name: "title", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "intro", type: "text", rows: 3 }),
      defineField({ name: "image", type: "imageWithAlt" }),
    ]),
    section("intro", "Visual Story Introduction", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
    ]),
    section("gallery", "Gallery Section", [eyebrow, heading, intro]),
    section("featuredMoments", "Featured Moments", [eyebrow, heading, intro]),
    section("community", "Community Highlight", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", type: "imageWithAlt" }),
    ]),
    section("finalCta", "Final Conversion", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Gallery Page" }) },
});
