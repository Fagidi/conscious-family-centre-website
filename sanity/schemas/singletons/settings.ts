import { defineArrayMember, defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ name: "label", title: "Menu Label", type: "string", validation: (r) => r.required() }),
  defineField({ name: "href", title: "Link", type: "string", validation: (r) => r.required(), description: "Page address (e.g. /programs)" }),
  defineField({ name: "group", title: "Menu Group", type: "string", description: "Optional group name for the mega menu" }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact Details" },
    { name: "social", title: "Social Media & Banner" },
    { name: "seo", title: "Search Engine Settings" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", group: "general", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "general" }),
    defineField({ name: "phone", title: "Phone Number", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp Number", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email Address", type: "string", group: "contact" }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "line", title: "Street Address", type: "string" }),
        defineField({ name: "area", title: "Area", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "mapUrl", title: "Google Maps Link", type: "url" }),
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({ name: "hours", title: "Opening Hours", type: "array", of: [{ type: "string" }], group: "contact" }),
    defineField({
      name: "socials",
      title: "Social Media Links",
      type: "object",
      group: "social",
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
    defineField({
      name: "announcement",
      title: "Announcement Banner",
      description: "Top-of-site banner for important announcements (Summer Camp, Open Enrolments, Community Events)",
      type: "object",
      group: "social",
      fields: [
        defineField({ name: "active", title: "Show Banner", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Banner Text", type: "string", validation: (r) => r.max(120) }),
        defineField({ name: "ctaLabel", title: "Button Text", type: "string" }),
        defineField({ name: "link", title: "Button Link", type: "string", description: "Where the banner button goes (e.g. /summer-camp)" }),
      ],
    }),
    defineField({ name: "defaultSeo", title: "Default Search Engine Settings", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation Menus",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header Menu",
      type: "array",
      description: "The main navigation at the top of every page",
      of: [
        defineArrayMember({
          type: "object",
          name: "navGroup",
          fields: [
            ...navItemFields,
            defineField({
              name: "children",
              title: "Dropdown Items",
              type: "array",
              description: "Sub-menu items shown in a dropdown",
              of: [defineArrayMember({ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } })],
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer Columns",
      type: "array",
      description: "Link groups shown at the bottom of every page",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Column Title", type: "string" }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [defineArrayMember({ type: "object", fields: navItemFields, preview: { select: { title: "label" } } })],
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation Menus" }) },
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
