import { defineField, defineType } from "sanity";

/**
 * Reusable objects shared across documents. Keeping these centralized means
 * the GROQ projections in lib/sanity/queries.ts stay consistent everywhere.
 */

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers & SEO.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Meta title", type: "string", validation: (r) => r.max(60) }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 2,
      validation: (r) => r.max(160),
    }),
    defineField({ name: "ogImage", title: "Social share image", type: "image" }),
    defineField({ name: "keywords", title: "Keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "variant",
      type: "string",
      options: { list: ["primary", "secondary", "ghost"], layout: "radio" },
      initialValue: "primary",
    }),
  ],
});

export const priceTier = defineType({
  name: "priceTier",
  title: "Price tier",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "amount", title: "Amount (₦)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "unit",
      type: "string",
      options: { list: ["session", "day", "week", "term", "month", "course"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "note", type: "string" }),
  ],
  preview: {
    select: { label: "label", amount: "amount", unit: "unit" },
    prepare: ({ label, amount, unit }) => ({ title: `${label} — ₦${amount?.toLocaleString()}/${unit}` }),
  },
});

export const scheduleItem = defineType({
  name: "scheduleItem",
  title: "Schedule item",
  type: "object",
  fields: [
    defineField({ name: "time", type: "string", validation: (r) => r.required() }),
    defineField({ name: "activity", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { time: "time", activity: "activity" }, prepare: ({ time, activity }) => ({ title: `${time} · ${activity}` }) },
});

export const sharedObjects = [imageWithAlt, seo, cta, priceTier, scheduleItem];
