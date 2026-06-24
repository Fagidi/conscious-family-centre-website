import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
    defineField({ name: "bio", title: "Short Bio", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "name", media: "photo" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Profile Page Address",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
      description: "Click 'Generate' to create automatically from the name",
    }),
    defineField({ name: "role", title: "Job Title / Role", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Leadership", value: "leadership" },
          { title: "Education", value: "education" },
          { title: "Operations", value: "operations" },
          { title: "Creative", value: "creative" },
          { title: "Support", value: "support" },
        ],
      },
    }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "A brief introduction shown on cards and previews (1-2 sentences)",
    }),
    defineField({
      name: "fullBio",
      title: "Full Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed biography shown on the full profile page",
    }),
    defineField({ name: "qualifications", title: "Qualifications", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "email", title: "Email Address", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "twitter", title: "Twitter / X", type: "url" }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this person prominently on the About Us page",
    }),
    defineField({
      name: "founder",
      title: "Founder",
      type: "boolean",
      initialValue: false,
      description: "Mark as the centre's founder (appears on the Founder page)",
    }),
    defineField({
      name: "founderPhilosophy",
      title: "Founding Philosophy",
      type: "text",
      rows: 4,
      hidden: ({ document }) => !document?.founder,
      description: "Shown on the Founder page only",
    }),
    defineField({
      name: "founderVision",
      title: "Vision for the Future",
      type: "text",
      rows: 4,
      hidden: ({ document }) => !document?.founder,
      description: "Shown on the Founder page only",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Position",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo", founder: "founder" },
    prepare: ({ title, subtitle, media, founder }) => ({
      title: founder ? `⭐ ${title}` : title,
      subtitle,
      media,
    }),
  },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "What They Said", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "authorName", title: "Parent / Guardian Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "childAge", title: "Child's Age", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
    defineField({ name: "program", title: "Related Program", type: "reference", to: [{ type: "program" }] }),
    defineField({ name: "videoUrl", title: "Video Link", type: "url", description: "YouTube or Vimeo link (optional)" }),
    defineField({ name: "consent", title: "Permission to Share", type: "boolean", initialValue: false, description: "Confirm that we have permission to publish this testimonial" }),
    defineField({ name: "order", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "authorName", subtitle: "quote", media: "photo" } },
});

export const galleryCategory = defineType({
  name: "galleryCategory",
  title: "Album",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Album Name", type: "string", validation: (r) => r.required() }),
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

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Photo",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Photo", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      description: "Click 'Generate' to create automatically",
    }),
    defineField({ name: "category", title: "Album", type: "reference", to: [{ type: "galleryCategory" }] }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "description", title: "Story", type: "text", rows: 2, description: "Optional short story shown when the photo is enlarged" }),
    defineField({ name: "featured", title: "Featured Moment", type: "boolean", initialValue: false, description: "Highlight this photo in the Featured Moments section" }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, description: "Add tags to help organize photos" }),
    defineField({ name: "program", title: "Related Program", type: "reference", to: [{ type: "program" }] }),
    defineField({ name: "date", title: "Date Taken", type: "date" }),
    defineField({ name: "order", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [
    { name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] },
    { name: "byDate", title: "Newest first", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "caption", media: "image" } },
});

export const featuredStory = defineType({
  name: "featuredStory",
  title: "Featured Story",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web Address",
      type: "slug",
      options: { source: "title" },
      description: "Click 'Generate' to create automatically",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (r) => r.min(1).max(6),
    }),
    defineField({ name: "cta", title: "Button", type: "cta" }),
    defineField({ name: "order", title: "Display Position", type: "number", initialValue: 0, description: "Lower numbers appear first" }),
  ],
  orderings: [{ name: "manual", title: "Display position", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const proofDocuments = [author, teamMember, testimonial, galleryCategory, galleryItem, featuredStory];
