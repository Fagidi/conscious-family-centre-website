import { defineField, defineType } from "sanity";
import { AGE_BAND_LIST, PROGRAM_LABELS } from "../../../lib/constants";

const ageBandOptions = AGE_BAND_LIST.map((b) => ({ title: `${b.label} (${b.range})`, value: b.id }));
const programTypeOptions = Object.entries(PROGRAM_LABELS).map(([value, title]) => ({ title, value }));

export const programCategory = defineType({
  name: "programCategory",
  title: "Program category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "type", type: "string", options: { list: programTypeOptions }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "programCategory" }], group: "content", description: "Optional grouping on the Programs page." }),
    defineField({ name: "ageBands", type: "array", of: [{ type: "string" }], options: { list: ageBandOptions }, group: "content" }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content", validation: (r) => r.required() }),
    defineField({ name: "heroImage", type: "imageWithAlt", group: "content" }),
    defineField({ name: "learningExperience", title: "Learning experience", type: "text", rows: 3, group: "content", description: "What the experience feels like for a child." }),
    defineField({ name: "keyBenefits", title: "Key benefits", type: "array", of: [{ type: "string" }], group: "content", description: "Outcomes-focused bullets (confidence, creativity…)." }),
    defineField({ name: "typicalActivities", title: "Typical activities", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }], group: "content" }),
    defineField({ name: "dayInTheLife", title: "A day in the life", type: "array", of: [{ type: "scheduleItem" }], group: "details" }),
    defineField({ name: "ratio", title: "Adult:child ratio", type: "string", group: "details" }),
    defineField({ name: "groupSize", type: "string", group: "details" }),
    defineField({ name: "schedule", type: "string", group: "details" }),
    defineField({ name: "pricing", type: "array", of: [{ type: "priceTier" }], group: "details" }),
    defineField({ name: "whatToBring", title: "What to bring", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "imageWithAlt" }], group: "details" }),
    defineField({ name: "faqs", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }], group: "details" }),
    defineField({ name: "cta", type: "cta", group: "content" }),
    defineField({ name: "order", type: "number", group: "content", initialValue: 0 }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "type", media: "heroImage" } },
});

export const campSession = defineType({
  name: "campSession",
  title: "Camp session",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "logistics", title: "Logistics & pricing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "season", type: "string", description: 'e.g. "Summer 2026"', group: "content" }),
    defineField({ name: "theme", type: "string", group: "content" }),
    defineField({ name: "ageBand", title: "Age band (display)", type: "string", description: 'e.g. "Ages 4–10"', group: "content" }),
    defineField({ name: "heroImage", type: "imageWithAlt", group: "content" }),
    defineField({ name: "startDate", type: "date", group: "logistics", validation: (r) => r.required() }),
    defineField({ name: "endDate", type: "date", group: "logistics", validation: (r) => r.required() }),
    defineField({ name: "dailySchedule", type: "text", rows: 3, group: "logistics" }),
    defineField({ name: "capacity", type: "number", group: "logistics", validation: (r) => r.required().min(1) }),
    defineField({ name: "priceNGN", title: "Price (₦)", type: "number", group: "logistics", validation: (r) => r.required().min(0) }),
    defineField({ name: "earlyBirdPriceNGN", title: "Early-bird price (₦)", type: "number", group: "logistics" }),
    defineField({ name: "earlyBirdUntil", title: "Early-bird until", type: "date", group: "logistics" }),
    defineField({ name: "siblingDiscountPct", title: "Sibling discount (%)", type: "number", group: "logistics", validation: (r) => r.min(0).max(100) }),
    defineField({ name: "included", title: "What's included", type: "array", of: [{ type: "string" }], group: "logistics" }),
    defineField({ name: "packingList", title: "Packing list", type: "array", of: [{ type: "string" }], group: "logistics" }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["upcoming", "open", "full", "closed", "past"], layout: "radio" },
      initialValue: "upcoming",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ name: "byDate", title: "By start date", by: [{ field: "startDate", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "season", media: "heroImage", status: "status" },
    prepare: ({ title, subtitle, media, status }) => ({ title, subtitle: `${subtitle ?? ""} · ${status}`, media }),
  },
});

export const learningDocuments = [programCategory, program, campSession];
