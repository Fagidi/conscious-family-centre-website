import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({ name: "bio", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "name", media: "photo" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
      description: "Used for the team member's profile page URL (/about/team/…).",
    }),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({ name: "qualifications", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "authorName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "childAge", type: "string" }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({ name: "program", type: "reference", to: [{ type: "program" }] }),
    defineField({ name: "videoUrl", title: "Video URL", type: "url" }),
    defineField({ name: "consent", title: "Consent on file", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "authorName", subtitle: "quote", media: "photo" } },
});

export const galleryCategory = defineType({
  name: "galleryCategory",
  title: "Gallery category",
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

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    defineField({ name: "image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "category", type: "reference", to: [{ type: "galleryCategory" }] }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "description", type: "text", rows: 2, description: "Optional short story shown in the lightbox." }),
    defineField({ name: "featured", title: "Featured moment", type: "boolean", initialValue: false }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "program", type: "reference", to: [{ type: "program" }] }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
    { name: "byDate", title: "Newest", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "caption", media: "image" } },
});

export const featuredStory = defineType({
  name: "featuredStory",
  title: "Featured story",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({ name: "cta", type: "cta" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const proofDocuments = [author, teamMember, testimonial, galleryCategory, galleryItem, featuredStory];
