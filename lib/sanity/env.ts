/**
 * Sanity environment — read once, validated here so the rest of the app
 * can rely on typed, trimmed values. Public vars are safe in the browser;
 * the write token is server-only and never imported into client code.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/** Server-only: required for server actions that write registrations/enquiries. */
export const writeToken = process.env.SANITY_WRITE_TOKEN;

/** True once a Sanity project is configured. */
export const sanityEnabled = Boolean(projectId);

/** Content revalidation window (seconds) for read queries. */
export const REVALIDATE = 60;
