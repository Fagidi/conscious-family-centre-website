import { defineField, defineType } from "sanity";

export const seoSettings = defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Default Meta Title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep titles under 70 characters"),
    }),
    defineField({
      name: "metaDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep descriptions under 160 characters"),
    }),
    defineField({ name: "ogImage", title: "Default Social Share Image", type: "image" }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: { prepare: () => ({ title: "SEO Settings" }) },
});
