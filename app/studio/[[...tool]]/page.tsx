"use client";

/**
 * Sanity Studio, embedded at /studio.
 * Editors sign in here to manage hero content, services, testimonials,
 * gallery, FAQ, contact information, site settings, and SEO.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
