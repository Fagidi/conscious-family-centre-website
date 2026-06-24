"use server";

import { writeClient } from "../sanity/client";
import { inquirySchema } from "../validation/inquiry";
import { notifyTeam, notifyCustomer } from "../notify";
import type { ActionResult, InquiryInput } from "../types";

/**
 * Contact-page inquiry: validate (Zod) → persist to Sanity (`inquiry`) →
 * notify admins → confirm to the parent → return a typed result. Server-side
 * validation mirrors the client form exactly (shared schema). Email transport
 * no-ops until a provider key is set (lib/notify).
 */
export async function submitInquiry(input: InquiryInput): Promise<ActionResult<{ received: true }>> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  // 1. Persist the submission (when the CMS is connected).
  if (writeClient) {
    await writeClient.create({
      _type: "inquiry",
      ...data,
      status: "new",
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Notify the team.
  await notifyTeam({
    subject: `New inquiry from ${data.parentName}`,
    body: [
      `Name: ${data.parentName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      data.childAge ? `Child age: ${data.childAge}` : null,
      `Program interest: ${data.programInterest}`,
      `Preferred contact: ${data.preferredContact}`,
      "",
      data.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  // 3. Confirm to the parent.
  await notifyCustomer(
    data.email,
    "Thanks for reaching out to Conscious Family Centre",
    `Hi ${data.parentName},\n\nThank you for getting in touch — we've received your message and one of our team will reply soon. We can't wait to welcome your family.\n\nWarmly,\nConscious Family Centre`,
  );

  return { ok: true, data: { received: true } };
}
