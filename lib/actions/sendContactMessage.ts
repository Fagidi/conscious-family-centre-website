"use server";

import { writeClient } from "../sanity/client";
import { validateContact } from "../validation";
import { notifyTeam } from "../notify";
import type { ActionResult, ContactMessageInput } from "../types";

/** General contact message — stored and emailed to the team. */
export async function sendContactMessage(
  input: ContactMessageInput,
): Promise<ActionResult<{ received: true }>> {
  const fieldErrors = validateContact(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  if (writeClient) {
    await writeClient.create({
      _type: "contactMessage",
      ...input,
      createdAt: new Date().toISOString(),
    });
  }

  await notifyTeam({
    subject: `Contact form: ${input.subject}`,
    body: `${input.name} (${input.email}${input.phone ? `, ${input.phone}` : ""}):\n\n${input.message}`,
  });

  return { ok: true, data: { received: true } };
}
