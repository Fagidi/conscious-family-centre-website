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

/**
 * Fetch from Sanity with a curated fallback. If the CMS is not configured,
 * the query fails, or the document hasn't been published yet, the default
 * content from lib/content.ts renders instead — so the site is always whole.
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
    if (data == null) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}
