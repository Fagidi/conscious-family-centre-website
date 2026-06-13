import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/** True once a Sanity project is configured via environment variables. */
export const sanityEnabled = Boolean(projectId);

export const client: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Field-level merge of a Sanity result over the curated fallback.
 *
 * Editors fill documents incrementally — a published hero without an
 * image, or a page document with only the SEO tab completed, must not
 * blank out the section. Rules:
 *  - null/undefined from Sanity → keep the fallback value
 *  - plain objects → merge recursively, keyed by the fallback's shape
 *  - arrays → Sanity wins wholesale when non-empty, else fallback
 *  - primitives → Sanity wins
 */
export function mergeWithFallback<T>(fallback: T, data: unknown): T {
  if (data === null || data === undefined) return fallback;
  if (Array.isArray(fallback)) {
    return Array.isArray(data) && data.length > 0 ? (data as T) : fallback;
  }
  if (isPlainObject(fallback) && isPlainObject(data)) {
    const merged: Record<string, unknown> = {};
    for (const key of Object.keys(fallback)) {
      merged[key] = mergeWithFallback((fallback as Record<string, unknown>)[key], data[key]);
    }
    return merged as T;
  }
  return data as T;
}

/**
 * Fetch from Sanity with a curated fallback. If the CMS is not configured,
 * the query fails, or the document hasn't been published yet, the default
 * content from lib/content.ts renders instead. Partial documents are
 * completed field-by-field from the fallback — the site is always whole.
 */
export async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!client) return fallback;
  try {
    const data = await client.fetch<T | null>(query, params, {
      next: { revalidate: 60 },
    });
    return mergeWithFallback(fallback, data);
  } catch {
    return fallback;
  }
}
