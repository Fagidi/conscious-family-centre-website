import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Contact Page — a singleton holding the framing copy + media. Contact details
 * (phone/email/address/hours/map) live in `siteSettings`; the featured camp
 * comes from `campSession`; the FAQ preview from `faq`. Mirrors the other page
 * singletons.
 */

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true, collapsed: true }, fields });

const eyebrow = defineField({ name: "eyebrow", type: "string" });
const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const intro = defineField({ name: "intro", type: "text", rows: 2 });

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
    section("welcome", "Welcome", [
      eyebrow,
      heading,
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }),
    ]),
    section("form", "Inquiry Form", [eyebrow, heading, intro]),
    section("visit", "Book a Visit", [
      eyebrow,
      heading,
      defineField({ name: "description", type: "text", rows: 2 }),
      defineField({ name: "benefits", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "cta", type: "cta" }),
    ]),
    section("journey", "Getting Started", [
      eyebrow,
      heading,
      intro,
      defineField({
        name: "steps",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({ name: "title", type: "string", validation: (r) => r.required() }),
              defineField({ name: "description", type: "text", rows: 2 }),
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
      defineField({ name: "description", type: "text", rows: 2 }),
      defineField({ name: "availabilityNote", title: "Availability note", type: "string" }),
      defineField({ name: "cta", type: "cta" }),
    ]),
    section("faq", "FAQ Preview", [eyebrow, heading]),
    section("finalCta", "Final Conversion", [
      eyebrow,
      heading,
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({ name: "ctas", type: "array", of: [{ type: "cta" }], validation: (r) => r.max(3) }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
