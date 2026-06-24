"use server";

import { writeClient } from "../sanity/client";
import { validateTourBooking } from "../validation";
import { notifyTeam } from "../notify";
import type { ActionResult, TourBookingInput } from "../types";

/**
 * Tour booking — the primary mid-funnel conversion ("the best way to
 * understand CFC is to experience it"). Captures preferred dates for the
 * team to confirm.
 */
export async function bookTour(input: TourBookingInput): Promise<ActionResult<{ received: true }>> {
  const fieldErrors = validateTourBooking(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  if (!writeClient) {
    return { ok: false, error: "Tour booking is temporarily unavailable. Please use WhatsApp." };
  }

  await writeClient.create({
    _type: "tourBooking",
    guardian: input.guardian,
    preferredDates: input.preferredDates,
    partySize: input.partySize,
    message: input.message,
    status: "new",
    createdAt: new Date().toISOString(),
  });

  await notifyTeam({
    subject: `New tour request — ${input.guardian.name}`,
    body: `Preferred: ${input.preferredDates.join(", ")} · party of ${input.partySize}.`,
  });

  return { ok: true, data: { received: true } };
}
