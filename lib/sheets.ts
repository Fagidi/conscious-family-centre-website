import "server-only";

/**
 * Google Sheets sync — a thin seam over a Google Apps Script webhook. The
 * registration is ALWAYS saved to Sanity first; this append is best-effort and
 * never throws, so a Sheets outage can't fail a registration. Set
 * GOOGLE_SHEETS_WEBHOOK_URL to enable; until then it no-ops with a log.
 */

export interface SheetSyncResult {
  ok: boolean;
  error?: string;
}

export async function appendRegistrationRow(row: Record<string, unknown>): Promise<SheetSyncResult> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.info("[sheets:noop] append skipped (no GOOGLE_SHEETS_WEBHOOK_URL)");
    return { ok: false, error: "not-configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    if (!res.ok) return { ok: false, error: `sheets responded ${res.status}` };
    return { ok: true };
  } catch (err) {
    console.error("[sheets] append failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
