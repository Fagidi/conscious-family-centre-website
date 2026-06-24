import { defineField, defineType } from "sanity";

/**
 * FAQ Page — a singleton holding the framing copy + hero media. The questions
 * come from `faq` documents (each linked to a `faqCategory`). Mirrors the
 * homePage / aboutPage / programsPage / galleryPage singleton pattern.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
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
    section("featured", "Featured Questions", [eyebrow, heading, intro]),
    section("browse", "Browse / Search", [eyebrow, heading, intro]),
    section("support", "Still Have Questions", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    section("finalCta", "Final Conversion", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "FAQ Page" }) },
});
