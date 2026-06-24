"use server";

import { writeClient } from "../sanity/client";
import { validateNewsletter } from "../validation";
import type { ActionResult, NewsletterInput } from "../types";

/**
 * Newsletter signup. Persists the subscriber; swap the body for an ESP
 * call (Mailchimp/Brevo) when one is chosen — the call site is unaffected.
 */
export async function subscribeNewsletter(
  input: NewsletterInput,
): Promise<ActionResult<{ subscribed: true }>> {
  const fieldErrors = validateNewsletter(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please enter a valid email.", fieldErrors };
  }

  if (writeClient) {
    await writeClient.createIfNotExists({
      _id: `subscriber.${input.email.replace(/[^a-z0-9]/gi, "-")}`,
      _type: "subscriber",
      email: input.email,
      createdAt: new Date().toISOString(),
    });
  }

  return { ok: true, data: { subscribed: true } };
}
