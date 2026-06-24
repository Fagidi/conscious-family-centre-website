import "server-only";
import { writeClient } from "../sanity/client";
import { getPaymentProvider } from "./index";
import { notifyTeam, notifyCustomer } from "../notify";
import type { PaymentGateway } from "../types";

/**
 * Fulfil a camp registration after a webhook fires. The webhook is only a
 * trigger — we re-verify with the gateway (source of truth) before flipping
 * the pending record to `paid`. Capacity is enforced implicitly: spots are
 * counted from paid registrations, so fulfilment is the moment a seat is
 * truly taken. Idempotent: already-paid records are left untouched.
 */
export async function fulfilRegistration(
  reference: string,
  gateway: PaymentGateway,
): Promise<{ fulfilled: boolean }> {
  if (!writeClient) return { fulfilled: false };

  const verification = await getPaymentProvider(gateway).verify(reference);
  if (verification.status !== "success") return { fulfilled: false };

  const reg = await writeClient.fetch<{
    _id: string;
    status: string;
    guardian?: { email?: string; name?: string };
    "camp": { title?: string } | null;
  } | null>(
    `*[_type == "campRegistration" && reference == $reference][0]{ _id, status, guardian, "camp": camp->{ title } }`,
    { reference },
  );
  if (!reg || reg.status === "paid") return { fulfilled: reg?.status === "paid" };

  await writeClient.patch(reg._id).set({ status: "paid", paidAt: new Date().toISOString() }).commit();

  const campTitle = reg.camp?.title ?? "your camp";
  await notifyTeam({ subject: `Camp payment confirmed — ${reference}`, body: `${reg.guardian?.name ?? "A guardian"} paid for ${campTitle}.` });
  if (reg.guardian?.email) {
    await notifyCustomer(
      reg.guardian.email,
      `You're registered for ${campTitle}! 🌱`,
      `Hi ${reg.guardian.name ?? "there"}, your spot is confirmed. We'll send a reminder with the packing list closer to the date.`,
    );
  }

  return { fulfilled: true };
}
