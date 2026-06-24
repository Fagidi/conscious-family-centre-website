import "server-only";
import crypto from "node:crypto";
import type {
  PaymentProvider,
  InitPaymentParams,
  InitPaymentResult,
  VerifyResult,
  WebhookEvent,
  PaymentStatus,
} from "./types";

/**
 * Paystack adapter — Nigeria-first (cards, bank transfer, USSD). Amounts
 * are transacted in kobo (×100). Server-only: uses the secret key.
 */

const SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const BASE = "https://api.paystack.co";

function mapStatus(s: string): PaymentStatus {
  if (s === "success") return "success";
  if (s === "failed" || s === "abandoned") return "failed";
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
  if (!res.ok) throw new Error(`Paystack ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const paystack: PaymentProvider = {
  name: "paystack",

  async initialize(params: InitPaymentParams): Promise<InitPaymentResult> {
    const data = await api<{
      data: { authorization_url: string; access_code: string; reference: string };
    }>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100), // kobo
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      }),
    });
    return {
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  },

  async verify(reference: string): Promise<VerifyResult> {
    const data = await api<{ data: { status: string; amount: number; reference: string } }>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );
    return {
      status: mapStatus(data.data.status),
      reference: data.data.reference,
      amount: data.data.amount / 100,
      raw: data,
    };
  },

  verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
    if (!signature || !SECRET) return false;
    const hash = crypto.createHmac("sha512", SECRET).update(rawBody).digest("hex");
    return hash === signature;
  },

  parseWebhook(payload: unknown): WebhookEvent {
    const p = payload as { event: string; data: { status: string; reference: string; amount: number } };
    return {
      status: p.event === "charge.success" ? "success" : mapStatus(p.data.status),
      reference: p.data.reference,
      amount: p.data.amount / 100,
      raw: payload,
    };
  },
};
