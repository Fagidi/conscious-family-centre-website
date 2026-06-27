import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NotificationService } from "@/lib/notifications/service";
import type { TemplateKey } from "@/lib/notifications/types";

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

async function isAdmin(): Promise<boolean> {
  try {
    const token = (await cookies()).get("admin-session")?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, jwtSecret());
    return (payload as { role?: string }).role === "admin";
  } catch { return false; }
}

const VALID_KEYS: TemplateKey[] = [
  "confirmation", "approved", "rejected", "payment-reminder",
  "payment-received", "camp-reminder", "completion", "admin-alert",
];

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { templateKey, to } = body as { templateKey?: string; to?: string };

  if (!templateKey || !VALID_KEYS.includes(templateKey as TemplateKey)) {
    return NextResponse.json({ error: "Invalid templateKey" }, { status: 400 });
  }
  if (!to || !to.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const result = await NotificationService.sendTestEmail(templateKey as TemplateKey, to);
  return NextResponse.json(result);
}
