import { defineField, defineType } from "sanity";
import { sectionObjects } from "../objects/sections";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      group: "content",
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the title",
    }),
    defineField({ name: "excerpt", title: "Summary", type: "text", rows: 3, group: "content", description: "A short preview shown in listings" }),
    defineField({ name: "cover", title: "Cover Image", type: "imageWithAlt", group: "content" }),
    defineField({ name: "author", title: "Written By", type: "reference", to: [{ type: "author" }], group: "content" }),
    defineField({ name: "body", title: "Article Content", type: "array", of: [{ type: "block" }, { type: "imageWithAlt" }], group: "content" }),
    defineField({ name: "categories", title: "Topics", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "content" }),
    defineField({ name: "publishedAt", title: "Publish Date", type: "datetime", group: "content", initialValue: () => new Date().toISOString() }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [{ name: "newest", title: "Newest first", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", media: "cover" } },
});

export const guide = defineType({
  name: "guide",
  title: "Parent Guide",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the title",
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2 }),
    defineField({ name: "topic", title: "Topic", type: "string" }),
    defineField({ name: "body", title: "Content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "file", title: "Downloadable File", type: "file", description: "Upload a PDF or document that parents can download" }),
  ],
  preview: { select: { title: "title", subtitle: "topic" } },
});

export const faqCategory = defineType({
  name: "faqCategory",
  title: "Question Category",
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
    defineField({ name: "displayOrder", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const faq = defineType({
  name: "faq",
  title: "Question & Answer",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "faqCategory" }], validation: (r) => r.required() }),
    defineField({ name: "featured", title: "Show in Popular Questions", type: "boolean", initialValue: false }),
    defineField({ name: "popular", title: "Frequently Asked", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "category.title" } },
});

export const event = defineType({
  name: "event",
  title: "Term Date / Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "School Term", value: "term" },
          { title: "Holiday", value: "holiday" },
          { title: "Camp", value: "camp" },
          { title: "Event", value: "event" },
        ],
        layout: "radio",
      },
      initialValue: "term",
    }),
    defineField({ name: "startDate", title: "Start Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "End Date", type: "date" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  orderings: [{ name: "byDate", title: "By date", by: [{ field: "startDate", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "type" } },
});

export const policy = defineType({
  name: "policy",
  title: "Policy",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the title",
    }),
    defineField({ name: "body", title: "Content", type: "array", of: [{ type: "block" }], validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title" } },
});

export const page = defineType({
  name: "page",
  title: "Custom Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      group: "content",
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the title",
    }),
    defineField({
      name: "sections",
      title: "Page Content",
      type: "array",
      of: sectionObjects.map((s) => ({ type: s.name })),
      group: "content",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const editorialDocuments = [post, guide, faqCategory, faq, event, policy, page];
