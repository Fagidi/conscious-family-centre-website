"use server";

import { writeClient } from "../sanity/client";
import { validateEnquiry } from "../validation";
import { notifyTeam } from "../notify";
import type { ActionResult, AdmissionEnquiryInput } from "../types";

/**
 * Admissions enquiry (Homeschool Hub & membership). Persists a `new`
 * enquiry for the team to action in Studio and alerts them. The tour is
 * the experiential close, offered on the confirmation step (BLUEPRINT §10).
 */
export async function submitEnquiry(
  input: AdmissionEnquiryInput,
): Promise<ActionResult<{ received: true }>> {
  const fieldErrors = validateEnquiry(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  if (!writeClient) {
    return { ok: false, error: "Enquiries are temporarily unavailable. Please use WhatsApp." };
  }

  await writeClient.create({
    _type: "admissionEnquiry",
    childName: input.childName,
    childAge: input.childAge,
    programInterest: input.programInterest,
    preferredStart: input.preferredStart,
    guardian: input.guardian,
    message: input.message,
    status: "new",
    createdAt: new Date().toISOString(),
  });

  await notifyTeam({
    subject: `New admissions enquiry — ${input.childName}`,
    body: `${input.guardian.name} (${input.guardian.email}) enquired about ${input.programInterest.join(", ")}.`,
  });

  return { ok: true, data: { received: true } };
}
