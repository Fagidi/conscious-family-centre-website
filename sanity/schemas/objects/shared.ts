import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Image Description",
      type: "string",
      description: "Describe what's in this image (helps with accessibility and search engines)",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Search Engine Settings",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Page Title (for search results)", type: "string", validation: (r) => r.max(60) }),
    defineField({
      name: "description",
      title: "Page Description (for search results)",
      type: "text",
      rows: 2,
      validation: (r) => r.max(160),
    }),
    defineField({ name: "ogImage", title: "Social Media Preview Image", type: "image" }),
    defineField({
      name: "keywords",
      title: "Search Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Words people might search for to find this page",
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Button Text", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      validation: (r) => r.required(),
      description: "Where the button goes (e.g. /programs or https://...)",
    }),
    defineField({
      name: "variant",
      title: "Button Style",
      type: "string",
      options: {
        list: [
          { title: "Primary (filled)", value: "primary" },
          { title: "Secondary (outlined)", value: "secondary" },
          { title: "Text only", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
});

export const priceTier = defineType({
  name: "priceTier",
  title: "Price Option",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "amount", title: "Amount (₦)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "unit",
      title: "Per",
      type: "string",
      options: {
        list: [
          { title: "Per session", value: "session" },
          { title: "Per day", value: "day" },
          { title: "Per week", value: "week" },
          { title: "Per term", value: "term" },
          { title: "Per month", value: "month" },
          { title: "Per course", value: "course" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "note", title: "Extra Info", type: "string", description: "e.g. 'includes materials' or 'sibling discount available'" }),
  ],
  preview: {
    select: { label: "label", amount: "amount", unit: "unit" },
    prepare: ({ label, amount, unit }) => ({ title: `${label} — ₦${amount?.toLocaleString()}/${unit}` }),
  },
});

export const scheduleItem = defineType({
  name: "scheduleItem",
  title: "Activity",
  type: "object",
  fields: [
    defineField({ name: "time", title: "Time", type: "string", validation: (r) => r.required() }),
    defineField({ name: "activity", title: "Activity", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { time: "time", activity: "activity" }, prepare: ({ time, activity }) => ({ title: `${time} · ${activity}` }) },
});

export const timelineEvent = defineType({
  name: "timelineEvent",
  title: "Timeline Event",
  type: "object",
  readOnly: true,
  fields: [
    defineField({ name: "title", title: "Event", type: "string" }),
    defineField({ name: "timestamp", title: "When", type: "datetime" }),
    defineField({ name: "actor", title: "By", type: "string" }),
    defineField({ name: "note", title: "Note", type: "text" }),
  ],
  preview: {
    select: { title: "title", timestamp: "timestamp", actor: "actor" },
    prepare: ({ title, timestamp, actor }: { title?: string; timestamp?: string; actor?: string }) => ({
      title: title ?? "—",
      subtitle: [actor, timestamp ? new Date(timestamp).toLocaleString("en-GB") : ""].filter(Boolean).join(" · "),
    }),
  },
});

export const sharedObjects = [imageWithAlt, seo, cta, priceTier, scheduleItem, timelineEvent];
