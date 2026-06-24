import { createClient, type SanityClient } from "next-sanity";
import { projectId, dataset, apiVersion, writeToken, sanityEnabled, REVALIDATE } from "./env";

/**
 * Read client — CDN-backed, published perspective. Used by all page reads.
 * Null when Sanity isn't configured, so the fallback layer takes over.
 */
export const client: SanityClient | null = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/**
 * Write client — server-only. Used by server actions to persist camp
 * registrations, enquiries, tour bookings, and to decrement capacity.
 * Never import this into a "use client" module.
 */
export const writeClient: SanityClient | null =
  sanityEnabled && writeToken
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token: writeToken })
    : null;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Field-level merge of a Sanity result over curated fallback content.
 * Editors fill documents incrementally; a half-finished document must
 * never blank out a section.
 *  - null/undefined from Sanity → keep the fallback
 *  - plain objects → merge recursively by the fallback's shape
 *  - arrays → Sanity wins when non-empty, else fallback
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
 * Fetch a singleton/object with a curated fallback. If the CMS is off,
 * the query fails, or the doc is unpublished, the fallback renders;
 * partial documents are completed field-by-field.
 */
export async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!client) return fallback;
  try {
    const data = await client.fetch<T | null>(query, params, { next: { revalidate: REVALIDATE } });
    return mergeWithFallback(fallback, data);
  } catch {
    return fallback;
  }
}

/**
 * Fetch a collection (array). Returns the fallback list when the CMS is
 * off or empty; never merges item-by-item (lists are replaced wholesale).
 */
export async function fetchList<T>(
  query: string,
  fallback: T[],
  params: Record<string, unknown> = {},
): Promise<T[]> {
  if (!client) return fallback;
  try {
    const data = await client.fetch<T[] | null>(query, params, { next: { revalidate: REVALIDATE } });
    return data && data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

/** Fetch a single document by query (no fallback) — returns null on miss. */
export async function fetchOne<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T | null>(query, params, { next: { revalidate: REVALIDATE } });
  } catch {
    return null;
  }
}
