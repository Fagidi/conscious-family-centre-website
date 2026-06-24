"use server";

import { writeClient } from "../sanity/client";
import { fetchOne } from "../sanity/client";
import { campAvailabilityQuery } from "../sanity/queries";
import { getPaymentProvider } from "../payments";
import { validateCampRegistration } from "../validation";
import { generateReference } from "../utils";
import type { ActionResult, CampRegistrationInput, PaymentGateway } from "../types";

interface CampAvailability {
  _id: string;
  capacity: number;
  status: string;
  priceNGN: number;
  earlyBirdPriceNGN?: number;
  earlyBirdUntil?: string;
  siblingDiscountPct?: number;
  spotsRemaining: number;
}

interface RegisterResult {
  authorizationUrl: string;
  reference: string;
  amountNGN: number;
}

/**
 * Camp registration — the primary conversion. Flow (BLUEPRINT §9):
 *  1. validate input
 *  2. re-check live availability server-side (never trust the client)
 *  3. price with early-bird + sibling discount
 *  4. persist a `pending` campRegistration
 *  5. initialise payment via the gateway-agnostic provider
 *  6. return the hosted checkout URL; the webhook flips status → paid
 *
 * `spotsRemaining` is derived from paid registrations, so capacity is
 * enforced by the webhook fulfilment, with this pre-check stopping the
 * obviously-full case early.
 */
export async function registerForCamp(
  input: CampRegistrationInput,
  gateway?: PaymentGateway,
): Promise<ActionResult<RegisterResult>> {
  const fieldErrors = validateCampRegistration(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  if (!writeClient) {
    return { ok: false, error: "Registration is temporarily unavailable. Please use WhatsApp." };
  }

  const camp = await fetchOne<CampAvailability>(campAvailabilityQuery, { slug: input.campSlug });
  if (!camp) return { ok: false, error: "That camp could not be found." };
  if (camp.status === "closed" || camp.status === "past") {
    return { ok: false, error: "Registration for this camp is closed." };
  }

  const childCount = input.children.length;
  if (camp.spotsRemaining < childCount) {
    return {
      ok: false,
      error:
        camp.spotsRemaining <= 0
          ? "This camp is full. Join the waitlist and we'll be in touch."
          : `Only ${camp.spotsRemaining} spot(s) remain for this camp.`,
    };
  }

  const amountNGN = priceRegistration(camp, childCount);
  const reference = generateReference("cfc-camp");

  // 4. Persist pending record (ties to the camp by reference for the webhook).
  await writeClient.create({
    _type: "campRegistration",
    reference,
    camp: { _type: "reference", _ref: camp._id },
    sessionKeys: input.sessionKeys,
    children: input.children,
    guardian: input.guardian,
    amountNGN,
    gateway: gateway ?? "paystack",
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // 5. Initialise checkout.
  try {
    const provider = getPaymentProvider(gateway);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const init = await provider.initialize({
      amount: amountNGN,
      email: input.guardian.email,
      reference,
      callbackUrl: `${siteUrl}/camps/confirmation?ref=${reference}`,
      metadata: { campSlug: input.campSlug, childCount },
    });
    return { ok: true, data: { authorizationUrl: init.authorizationUrl, reference, amountNGN } };
  } catch {
    return { ok: false, error: "We couldn't start the payment. Please try again." };
  }
}

/** Early-bird pricing + per-additional-child sibling discount. */
function priceRegistration(camp: CampAvailability, childCount: number): number {
  const earlyBirdActive =
    camp.earlyBirdPriceNGN &&
    camp.earlyBirdUntil &&
    new Date() <= new Date(camp.earlyBirdUntil);
  const unit = earlyBirdActive ? camp.earlyBirdPriceNGN! : camp.priceNGN;

  if (childCount <= 1 || !camp.siblingDiscountPct) return unit * childCount;
  const siblingUnit = unit * (1 - camp.siblingDiscountPct / 100);
  return Math.round(unit + siblingUnit * (childCount - 1));
}
