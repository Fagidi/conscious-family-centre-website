import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", initialValue: "Sarai Photo Booth" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "serviceArea", title: "Service Area", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "bookingCtaLabel", title: "Booking CTA Label", type: "string", initialValue: "Reserve Your Date" }),
    defineField({ name: "announcement", title: "Announcement Bar Text", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
