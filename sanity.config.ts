"use client";

/**
 * Sanity Studio configuration — mounted at /studio.
 *
 * Editors manage: page content (home/about/services/faq/contact),
 * page heroes, services, testimonials, gallery, FAQ, the shared
 * closing CTA, site settings, and SEO settings. Layout, animation,
 * and the design system stay in the codebase.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const singleton = (title: string, type: string) => (S: any) =>
  S.listItem().title(title).child(S.document().schemaType(type).documentId(type));

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
            // ── Pages (singletons, top-level so each is directly visible) ──
            singleton("Home Page", "homePage")(S),
            singleton("About Page", "aboutPage")(S),
            singleton("Services Page", "servicesPage")(S),
            singleton("FAQ Page", "faqPage")(S),
            singleton("Contact Page", "contactInfo")(S),
            S.divider(),
            // ── Collections ──
            S.documentTypeListItem("hero").title("Hero Content"),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
            S.documentTypeListItem("faqItem").title("FAQ"),
            S.divider(),
            // ── Global ──
            singleton("Closing CTA (all pages)", "ctaSection")(S),
            singleton("Site Settings", "siteSettings")(S),
            singleton("SEO Settings", "seoSettings")(S),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
