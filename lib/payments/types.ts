import type { PaymentGateway } from "../types";

/**
 * Gateway-agnostic payment contract. Flow code (server actions, webhooks)
 * depends only on `PaymentProvider` and never imports a vendor SDK, so we
 * can run Paystack and Flutterwave side by side or switch via env.
 * See lib/payments/index.ts for the factory and BLUEPRINT §9.
 */

export interface InitPaymentParams {
  /** Amount in major units (Naira). Adapters convert to kobo/cents. */
  amount: number;
  email: string;
  /** Our stable reference (lib/utils generateReference) — ties payment ↔ registration. */
  reference: string;
  /** Absolute URL the gateway returns the user to after payment. */
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitPaymentResult {
  /** Hosted checkout URL to redirect the user to. */
  authorizationUrl: string;
  reference: string;
  accessCode?: string;
}

export type PaymentStatus = "success" | "failed" | "pending";

export interface VerifyResult {
  status: PaymentStatus;
  reference: string;
  /** Amount in major units (Naira) as confirmed by the gateway. */
  amount: number;
  raw: unknown;
}

export interface WebhookEvent {
  status: PaymentStatus;
  reference: string;
  amount: number;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: PaymentGateway;
  /** Create a checkout session and return the redirect URL. */
  initialize(params: InitPaymentParams): Promise<InitPaymentResult>;
  /** Server-side verification of a reference (source of truth before fulfilment). */
  verify(reference: string): Promise<VerifyResult>;
  /** Validate a webhook signature against the raw request body. */
  verifyWebhookSignature(rawBody: string, signature: string | null): boolean;
  /** Normalise a webhook payload into our shape. */
  parseWebhook(payload: unknown): WebhookEvent;
}
