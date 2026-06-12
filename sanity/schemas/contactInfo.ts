import { defineField, defineType } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "titleLines",
      title: "Headline Lines",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "body", title: "Intro Copy", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Side Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({
      name: "eventTypes",
      title: "Event Type Options",
      description: "Options shown in the inquiry form's event type select.",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
