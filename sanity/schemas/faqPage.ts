import { defineField, defineType } from "sanity";
import { seoField } from "./fields";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  description:
    "Side note card and page SEO. The hero lives under Hero Content; questions pull from the FAQ collection.",
  fields: [
    defineField({
      name: "sideNote",
      title: "Side Note Card",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "text", rows: 2 }),
        defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "FAQ Page" }) },
});
