import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { fulfilRegistration } from "@/lib/payments/fulfil";

/**
 * Paystack webhook. Verifies the HMAC signature against the raw body,
 * then fulfils the registration (which re-verifies with the API before
 * marking it paid). Always 200 on a valid signature so Paystack stops
 * retrying; fulfilment is idempotent.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const provider = getPaymentProvider("paystack");

  if (!provider.verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = provider.parseWebhook(JSON.parse(raw));
  if (event.status === "success") {
    await fulfilRegistration(event.reference, "paystack");
  }
  return NextResponse.json({ received: true });
}
