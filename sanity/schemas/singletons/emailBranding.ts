import { defineField, defineType } from "sanity";

export const emailBranding = defineType({
  name: "emailBranding",
  title: "Email Branding",
  type: "document",
  fields: [
    defineField({ name: "senderName",       title: "Sender Name",        type: "string", initialValue: "Conscious Family Centre" }),
    defineField({ name: "senderEmail",      title: "Sender Email",       type: "string" }),
    defineField({ name: "replyTo",          title: "Reply-To Email",     type: "string" }),
    defineField({ name: "schoolAddress",    title: "School Address",     type: "string", initialValue: "Wuse 2, Abuja, Nigeria" }),
    defineField({ name: "phone",            title: "Phone Number",       type: "string" }),
    defineField({ name: "website",          title: "Website URL",        type: "url", initialValue: "https://consciousfamilycentre.com" }),
    defineField({ name: "facebook",         title: "Facebook URL",       type: "url" }),
    defineField({ name: "instagram",        title: "Instagram URL",      type: "url" }),
    defineField({ name: "footerCopyright",  title: "Footer Copyright",   type: "string", initialValue: "© 2026 Conscious Family Centre. All rights reserved." }),
    defineField({ name: "footerDisclaimer", title: "Footer Disclaimer",  type: "text",   rows: 2 }),
    defineField({ name: "accentColor",      title: "Accent Colour (hex)",type: "string", initialValue: "#2F5D45", description: "Used for headings and buttons in emails" }),
  ],
});
