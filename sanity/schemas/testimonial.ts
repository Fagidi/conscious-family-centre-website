import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "author", title: "Author", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "event",
      title: "Event",
      description: 'e.g. "Wedding — Oheka Castle, Huntington"',
      type: "string",
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "author", subtitle: "event" } },
});
