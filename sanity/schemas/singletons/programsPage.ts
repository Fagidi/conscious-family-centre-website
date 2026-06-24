import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Programs Page — a singleton holding the framing copy + media for the Programs
 * index. The programs themselves are `program` documents; this carries the hero,
 * overview, outcomes, experience, and the section headings. Mirrors homePage.ts.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

const cardArray = (name: string) =>
  defineField({
    name,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "title", type: "string", validation: (r) => r.required() }),
          defineField({ name: "description", type: "text", rows: 2 }),
          defineField({ name: "icon", type: "string", description: "Icon key (leaf, sprout, sun, compass…)" }),
        ],
        preview: { select: { title: "title" } },
      }),
    ],
    validation: (r) => r.min(3).max(6),
  });

export const programsPage = defineType({
  name: "programsPage",
  title: "Programs Page",
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
      defineField({ name: "primaryCta", type: "cta" }),
      defineField({ name: "secondaryCta", type: "cta" }),
    ]),
    section("overview", "Program Overview", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", type: "imageWithAlt" }),
    ]),
    section("outcomes", "Why Our Programs Matter", [eyebrow, heading, intro, cardArray("cards")]),
    section("experience", "Learning Through Experience", [eyebrow, heading, intro, cardArray("items")]),
    section("gallery", "Program Gallery", [eyebrow, heading, intro]),
    section("faq", "FAQ", [eyebrow, heading]),
    section("testimonials", "Testimonials", [eyebrow, heading]),
    section("finalCta", "Final Conversion", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Programs Page" }) },
});
