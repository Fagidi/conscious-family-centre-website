import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface ServiceStatus {
  name:    string;
  status:  "ok" | "warn" | "error";
  message: string;
  latency?: number;
}

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

async function checkAuth(): Promise<boolean> {
  try {
    const token = (await cookies()).get("admin-session")?.value;
    if (!token) return false;
    await jwtVerify(token, jwtSecret());
    return true;
  } catch { return false; }
}

async function checkSanity(): Promise<ServiceStatus> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return { name: "Sanity CMS", status: "error", message: "NEXT_PUBLIC_SANITY_PROJECT_ID not set" };
  const start = Date.now();
  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/production?query=*[_type=="siteSettings"][0]{_id}`, {
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - start;
    if (!res.ok) return { name: "Sanity CMS", status: "warn", message: `HTTP ${res.status}`, latency };
    return { name: "Sanity CMS", status: "ok", message: "Connected", latency };
  } catch (err) {
    return { name: "Sanity CMS", status: "error", message: err instanceof Error ? err.message : "Connection failed", latency: Date.now() - start };
  }
}

async function checkBrevo(): Promise<ServiceStatus> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { name: "Brevo Email", status: "warn", message: "API key not configured — emails will no-op" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - start;
    if (!res.ok) return { name: "Brevo Email", status: "error", message: `HTTP ${res.status} — check API key`, latency };
    const data = await res.json() as { email?: string };
    return { name: "Brevo Email", status: "ok", message: `Connected (${data.email ?? "verified"})`, latency };
  } catch (err) {
    return { name: "Brevo Email", status: "error", message: err instanceof Error ? err.message : "Connection failed", latency: Date.now() - start };
  }
}

function checkSanityWrite(): ServiceStatus {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) return { name: "Sanity Write", status: "error", message: "SANITY_WRITE_TOKEN not set" };
  return { name: "Sanity Write", status: "ok", message: "Token configured" };
}

function checkGoogleSheets(): ServiceStatus {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return { name: "Google Sheets", status: "warn", message: "Webhook URL not configured" };
  return { name: "Google Sheets", status: "ok", message: "Webhook URL configured" };
}

export async function GET() {
  const authed = await checkAuth();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [sanity, brevo] = await Promise.all([checkSanity(), checkBrevo()]);
  const sanityWrite = checkSanityWrite();
  const sheets      = checkGoogleSheets();

  const services: ServiceStatus[] = [sanity, sanityWrite, brevo, sheets];
  const overall = services.some((s) => s.status === "error")
    ? "error"
    : services.some((s) => s.status === "warn")
    ? "warn"
    : "ok";

  return NextResponse.json({ overall, services, checkedAt: new Date().toISOString() });
}
