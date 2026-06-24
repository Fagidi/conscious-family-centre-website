import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset, sanityEnabled } from "./env";

/**
 * Sanity image URL builder. Most images are resolved to a CDN URL in the
 * GROQ projection (see queries.ts), but use `urlFor` when a component
 * needs on-the-fly transforms (crop, width, format).
 *
 * Stock/placeholder imagery (e.g. Unsplash) bypasses this and is handled
 * by next/image remotePatterns in next.config.ts (see project memory).
 */
const builder = sanityEnabled ? imageUrlBuilder({ projectId: projectId!, dataset }) : null;

export function urlFor(source: Image) {
  if (!builder) throw new Error("Sanity image builder unavailable — project not configured.");
  return builder.image(source).auto("format").fit("max");
}
