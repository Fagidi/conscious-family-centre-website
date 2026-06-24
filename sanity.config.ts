"use client";

/**
 * Sanity Studio — mounted at /studio.
 *
 * Editors manage the full Conscious Family Centre content model: programs,
 * camps & registrations, admissions enquiries & tours, people/proof,
 * editorial content, term dates, and policies. Layout, the design system,
 * and motion stay in code. Desk layout lives in sanity/structure.ts.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "conscious-family-centre",
  title: "Conscious Family Centre",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
