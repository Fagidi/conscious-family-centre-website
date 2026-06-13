import { defineField } from "sanity";

/**
 * Shared field builders so every page document exposes the same
 * SEO tab and section-heading lockup shape.
 */

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta Title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep titles under 70 characters"),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep descriptions under 160 characters"),
    }),
  ],
});

export function sectionHeadingField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
      defineField({
        name: "titleLines",
        title: "Headline Lines",
        description: "Each entry renders as its own line of the headline.",
        type: "array",
        of: [{ type: "string" }],
        validation: (rule) => rule.min(1).max(3),
      }),
    ],
  });
}
