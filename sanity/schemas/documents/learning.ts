import { defineField, defineType } from "sanity";
import { AGE_BAND_LIST, PROGRAM_LABELS } from "../../../lib/constants";

const ageBandOptions = AGE_BAND_LIST.map((b) => ({ title: `${b.label} (${b.range})`, value: b.id }));
const programTypeOptions = Object.entries(PROGRAM_LABELS).map(([value, title]) => ({ title, value }));

export const programCategory = defineType({
  name: "programCategory",
  title: "Program Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Category Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "order", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Schedule & Pricing" },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    defineField({ name: "title", title: "Program Name", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      group: "content",
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the name",
    }),
    defineField({ name: "type", title: "Program Type", type: "string", options: { list: programTypeOptions }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "programCategory" }], group: "content", description: "Group this program under a category on the Programs page" }),
    defineField({ name: "ageBands", title: "Age Groups", type: "array", of: [{ type: "string" }], options: { list: ageBandOptions }, group: "content" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content", validation: (r) => r.required() }),
    defineField({ name: "heroImage", title: "Main Image", type: "imageWithAlt", group: "content" }),
    defineField({ name: "learningExperience", title: "Learning Experience", type: "text", rows: 3, group: "content", description: "Describe what a typical day feels like for a child in this program" }),
    defineField({ name: "keyBenefits", title: "Key Benefits", type: "array", of: [{ type: "string" }], group: "content", description: "What children gain from this program (e.g. confidence, creativity)" }),
    defineField({ name: "typicalActivities", title: "Typical Activities", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "body", title: "Full Description", type: "array", of: [{ type: "block" }], group: "content" }),
    defineField({ name: "dayInTheLife", title: "Daily Schedule", type: "array", of: [{ type: "scheduleItem" }], group: "details" }),
    defineField({ name: "ratio", title: "Staff to Child Ratio", type: "string", group: "details" }),
    defineField({ name: "groupSize", title: "Group Size", type: "string", group: "details" }),
    defineField({ name: "schedule", title: "Schedule", type: "string", group: "details" }),
    defineField({ name: "pricing", title: "Pricing", type: "array", of: [{ type: "priceTier" }], group: "details" }),
    defineField({ name: "whatToBring", title: "What to Bring", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "gallery", title: "Program Photos", type: "array", of: [{ type: "imageWithAlt" }], group: "details" }),
    defineField({ name: "faqs", title: "Related Questions", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }], group: "details", description: "Link frequently asked questions about this program" }),
    defineField({ name: "cta", title: "Button", type: "cta", group: "content" }),
    defineField({ name: "order", title: "Display Position", type: "number", group: "content", initialValue: 0, description: "Lower numbers appear first" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "type", media: "heroImage" } },
});

export const campSession = defineType({
  name: "campSession",
  title: "Camp Session",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "logistics", title: "Dates, Pricing & Logistics" },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    defineField({ name: "title", title: "Camp Name", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      group: "content",
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the name",
    }),
    defineField({ name: "season", title: "Season", type: "string", description: 'e.g. "Summer 2026"', group: "content" }),
    defineField({ name: "theme", title: "Theme", type: "string", group: "content" }),
    defineField({ name: "ageBand", title: "Age Range", type: "string", description: 'e.g. "Ages 4-10"', group: "content" }),
    defineField({ name: "heroImage", title: "Main Image", type: "imageWithAlt", group: "content" }),
    defineField({ name: "startDate", title: "Start Date", type: "date", group: "logistics", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "End Date", type: "date", group: "logistics", validation: (r) => r.required() }),
    defineField({ name: "dailySchedule", title: "Daily Schedule", type: "text", rows: 3, group: "logistics" }),
    defineField({ name: "capacity", title: "Maximum Capacity", type: "number", group: "logistics", validation: (r) => r.required().min(1) }),
    defineField({ name: "priceNGN", title: "Price (₦)", type: "number", group: "logistics", validation: (r) => r.required().min(0) }),
    defineField({ name: "earlyBirdPriceNGN", title: "Early Bird Price (₦)", type: "number", group: "logistics" }),
    defineField({ name: "earlyBirdUntil", title: "Early Bird Deadline", type: "date", group: "logistics" }),
    defineField({ name: "siblingDiscountPct", title: "Sibling Discount (%)", type: "number", group: "logistics", validation: (r) => r.min(0).max(100) }),
    defineField({ name: "included", title: "What's Included", type: "array", of: [{ type: "string" }], group: "logistics" }),
    defineField({ name: "packingList", title: "Packing List", type: "array", of: [{ type: "string" }], group: "logistics" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Coming Soon", value: "upcoming" },
          { title: "Open for Registration", value: "open" },
          { title: "Fully Booked", value: "full" },
          { title: "Registration Closed", value: "closed" },
          { title: "Completed", value: "past" },
        ],
        layout: "radio",
      },
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
