import { defineField, defineType } from "sanity";
import { sectionObjects } from "../objects/sections";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content" }),
    defineField({ name: "cover", type: "imageWithAlt", group: "content" }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], group: "content" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "imageWithAlt" }], group: "content" }),
    defineField({ name: "categories", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "content" }),
    defineField({ name: "publishedAt", type: "datetime", group: "content", initialValue: () => new Date().toISOString() }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ name: "newest", title: "Newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", media: "cover" } },
});

export const guide = defineType({
  name: "guide",
  title: "Parent guide",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 2 }),
    defineField({ name: "topic", type: "string" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "file", title: "Downloadable file", type: "file" }),
  ],
  preview: { select: { title: "title", subtitle: "topic" } },
});

export const faqCategory = defineType({
  name: "faqCategory",
  title: "FAQ category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Display order", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "faqCategory" }], validation: (r) => r.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false, description: "Show in Popular/Featured questions." }),
    defineField({ name: "popular", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "category.title" } },
});

export const event = defineType({
  name: "event",
  title: "Term date / event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      type: "string",
      options: { list: ["term", "holiday", "camp", "event"], layout: "radio" },
      initialValue: "term",
    }),
    defineField({ name: "startDate", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "description", type: "text", rows: 2 }),
  ],
  orderings: [{ name: "byDate", title: "By date", by: [{ field: "startDate", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "type" } },
});

export const policy = defineType({
  name: "policy",
  title: "Policy",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title" } },
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, group: "content", validation: (r) => r.required() }),
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      of: sectionObjects.map((s) => ({ type: s.name })),
      group: "content",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const editorialDocuments = [post, guide, faqCategory, faq, event, policy, page];
