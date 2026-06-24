import { defineArrayMember, defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  defineField({ name: "href", type: "string", validation: (r) => r.required() }),
  defineField({ name: "group", type: "string", description: "Optional group label (mega-menu)" }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social & banner" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({ name: "siteName", type: "string", group: "general", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "general" }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string", group: "contact" }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({
      name: "address",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "line", type: "string" }),
        defineField({ name: "area", type: "string" }),
        defineField({ name: "city", type: "string" }),
        defineField({ name: "mapUrl", title: "Map URL", type: "url" }),
        defineField({ name: "lat", type: "number" }),
        defineField({ name: "lng", type: "number" }),
      ],
    }),
    defineField({ name: "hours", title: "Opening hours", type: "array", of: [{ type: "string" }], group: "contact" }),
    defineField({
      name: "socials",
      type: "object",
      group: "social",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "facebook", type: "url" }),
        defineField({ name: "tiktok", type: "url" }),
        defineField({ name: "youtube", type: "url" }),
      ],
    }),
    defineField({
      name: "announcement",
      title: "Announcement banner",
      description: "Top-of-site banner — Summer Camp, Open Enrolments, Community Events.",
      type: "object",
      group: "social",
      fields: [
        defineField({ name: "active", title: "Show banner", type: "boolean", initialValue: false }),
        defineField({ name: "text", type: "string", validation: (r) => r.max(120) }),
        defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
        defineField({ name: "link", type: "string", description: "Where the banner/CTA links to." }),
      ],
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header menu",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navGroup",
          fields: [
            ...navItemFields,
            defineField({
              name: "children",
              type: "array",
              of: [defineArrayMember({ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } })],
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string" }),
            defineField({
              name: "links",
              type: "array",
              of: [defineArrayMember({ type: "object", fields: navItemFields, preview: { select: { title: "label" } } })],
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

export { homePage } from "./homePage";
export { aboutPage } from "./aboutPage";
export { programsPage } from "./programsPage";
export { galleryPage } from "./galleryPage";
export { faqPage } from "./faqPage";
export { contactPage } from "./contactPage";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { programsPage } from "./programsPage";
import { galleryPage } from "./galleryPage";
import { faqPage } from "./faqPage";
import { contactPage } from "./contactPage";
export const singletons = [siteSettings, navigation, homePage, aboutPage, programsPage, galleryPage, faqPage, contactPage];
