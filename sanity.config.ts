"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { campDashboardPlugin } from "./sanity/plugins/campDashboard";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SINGLETON_TYPES = new Set([
  "homePage",
  "aboutPage",
  "programsPage",
  "galleryPage",
  "faqPage",
  "contactPage",
  "siteSettings",
  "navigation",
  "campSettings",
]);

const SUBMISSION_TYPES = new Set([
  "campRegistration",
  "futureMakersRegistration",
  "admissionEnquiry",
  "tourBooking",
  "contactMessage",
  "inquiry",
  "subscriber",
]);

export default defineConfig({
  name: "conscious-family-centre",
  title: "Conscious Family Centre",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    campDashboardPlugin(),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETON_TYPES.has(item.templateId) && !SUBMISSION_TYPES.has(item.templateId)),
    actions: (prev, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return prev.filter((action) => action.action !== "delete" && action.action !== "duplicate");
      }
      return prev;
    },
  },
});
