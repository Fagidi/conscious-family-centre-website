import "server-only";
import type {
  PaymentProvider,
  InitPaymentParams,
  InitPaymentResult,
  VerifyResult,
  WebhookEvent,
  PaymentStatus,
} from "./types";

/**
 * Flutterwave adapter — pan-African + international card coverage. Amounts
 * are transacted in major units (Naira). Server-only: uses the secret key.
 * Webhooks are validated against a shared secret hash header, not HMAC.
 */

const SECRET = process.env.FLUTTERWAVE_SECRET_KEY ?? "";
const WEBHOOK_HASH = process.env.FLUTTERWAVE_WEBHOOK_HASH ?? "";
const BASE = "https://api.flutterwave.com/v3";

function mapStatus(s: string): PaymentStatus {
  const v = s?.toLowerCase();
  if (v === "successful" || v === "success") return "success";
  if (v === "failed" || v === "cancelled") return "failed";
  return "pending";
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Flutterwave ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const flutterwave: PaymentProvider = {
  name: "flutterwave",

  async initialize(params: InitPaymentParams): Promise<InitPaymentResult> {
    const data = await api<{ data: { link: string } }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        tx_ref: params.reference,
        amount: params.amount,
        currency: "NGN",
        redirect_url: params.callbackUrl,
        customer: { email: params.email },
        meta: params.metadata,
      }),
    });
    return { authorizationUrl: data.data.link, reference: params.reference };
  },

  async verify(reference: string): Promise<VerifyResult> {
    const data = await api<{
      data: { status: string; amount: number; tx_ref: string };
    }>(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`);
    return {
      status: mapStatus(data.data.status),
      reference: data.data.tx_ref,
      amount: data.data.amount,
      raw: data,
    };
  },

  verifyWebhookSignature(_rawBody: string, signature: string | null): boolean {
    if (!signature || !WEBHOOK_HASH) return false;
    return signature === WEBHOOK_HASH;
  },

  parseWebhook(payload: unknown): WebhookEvent {
    const p = payload as { data: { status: string; tx_ref: string; amount: number } };
    return {
      status: mapStatus(p.data.status),
      reference: p.data.tx_ref,
      amount: p.data.amount,
      raw: payload,
    };
  },
};
