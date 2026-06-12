"use client";

/**
 * Sanity Studio configuration — mounted at /studio.
 *
 * Editors manage: hero content, services, testimonials, gallery,
 * FAQ, contact information, site settings, and SEO settings.
 * Layout, animation, and the design system stay in the codebase.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "sarai-photo-booth",
  title: "Sarai Photo Booth",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("SEO Settings")
              .child(S.document().schemaType("seoSettings").documentId("seoSettings")),
            S.listItem()
              .title("Contact Page")
              .child(S.document().schemaType("contactInfo").documentId("contactInfo")),
            S.divider(),
            S.documentTypeListItem("hero").title("Hero Content"),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
            S.documentTypeListItem("faqItem").title("FAQ"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
