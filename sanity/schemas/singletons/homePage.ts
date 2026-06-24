import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Homepage — a singleton composing the hero + each marketing section's copy.
 * Showcased collections (programs, camps, testimonials, gallery, faqs) are
 * separate documents; this holds only the framing copy + the hero media.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    section("hero", "Hero", [
      eyebrow,
      defineField({ name: "headline", type: "text", rows: 2, validation: (r) => r.required() }),
      defineField({ name: "subhead", type: "text", rows: 2 }),
      defineField({ name: "image", type: "imageWithAlt" }),
      defineField({ name: "primaryCta", type: "cta" }),
      defineField({ name: "secondaryCta", type: "cta" }),
      defineField({ name: "tertiaryCta", type: "cta" }),
    ]),
    section("why", "Why Families Choose Us", [
      eyebrow,
      heading,
      intro,
      defineField({
        name: "pillars",
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
        validation: (r) => r.min(3).max(4),
      }),
    ]),
    section("about", "About Preview", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
      defineField({ name: "image", type: "imageWithAlt" }),
      defineField({ name: "cta", type: "cta" }),
    ]),
    section("programs", "Programs Preview", [eyebrow, heading, intro, defineField({ name: "cta", type: "cta" })]),
    section("camp", "Summer Camp Feature", [eyebrow, heading, intro]),
    section("gallery", "Gallery Preview", [eyebrow, heading, intro, defineField({ name: "cta", type: "cta" })]),
    section("testimonials", "Testimonials", [eyebrow, heading]),
    section("faq", "FAQ Preview", [eyebrow, heading, defineField({ name: "cta", type: "cta" })]),
    section("finalCta", "Final Conversion", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
