import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * About Page — a singleton holding the framing copy + media for each section
 * of the About experience. The Team section pulls from `teamMember` documents
 * and Testimonials from `testimonial` documents; this singleton only carries
 * the section headings/intros and the editorial imagery. Mirrors homePage.ts.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

/** Reusable "icon card" array (philosophy beliefs / differentiators). */
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

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    section("hero", "Hero", [
      eyebrow,
      defineField({ name: "title", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "mission", title: "Mission statement", type: "text", rows: 3 }),
      defineField({ name: "image", type: "imageWithAlt" }),
    ]),
    section("story", "Our Story", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", type: "imageWithAlt" }),
      defineField({ name: "pullQuote", title: "Pull quote", type: "text", rows: 2 }),
    ]),
    section("philosophy", "Our Philosophy", [eyebrow, heading, intro, cardArray("cards")]),
    section("differentiators", "What Makes Us Different", [eyebrow, heading, intro, cardArray("items")]),
    section("environment", "Learning Environment", [
      eyebrow,
      heading,
      intro,
      defineField({ name: "images", type: "array", of: [{ type: "imageWithAlt" }], validation: (r) => r.min(3).max(8) }),
    ]),
    section("team", "Meet the Team", [eyebrow, heading, intro]),
    section("testimonials", "Parent Testimonials", [eyebrow, heading]),
    section("community", "Community", [
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
  preview: { prepare: () => ({ title: "About Page" }) },
});
