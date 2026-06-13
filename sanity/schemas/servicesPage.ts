import { defineField, defineType } from "sanity";
import { seoField, sectionHeadingField } from "./fields";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  description:
    "Process section and page SEO. The hero lives under Hero Content; the service articles pull from the Services collection.",
  fields: [
    sectionHeadingField("processSection", "Process Section Heading"),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              description: 'Display number, e.g. "01".',
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Services Page" }) },
});
