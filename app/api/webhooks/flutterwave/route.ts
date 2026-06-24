import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { fulfilRegistration } from "@/lib/payments/fulfil";

/**
 * Flutterwave webhook. Validates the `verif-hash` header against the
 * configured secret hash, then fulfils the registration (re-verified with
 * the API before being marked paid). Idempotent.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("verif-hash");
  const provider = getPaymentProvider("flutterwave");

  if (!provider.verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = provider.parseWebhook(JSON.parse(raw));
  if (event.status === "success") {
    await fulfilRegistration(event.reference, "flutterwave");
  }
  return NextResponse.json({ received: true });
}
