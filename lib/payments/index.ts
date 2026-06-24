import "server-only";
import type { PaymentGateway } from "../types";
import type { PaymentProvider } from "./types";
import { paystack } from "./paystack";
import { flutterwave } from "./flutterwave";

/**
 * Payment provider factory. The default gateway is set by PAYMENT_PROVIDER
 * (defaults to Paystack), but any flow can request a specific one — both
 * adapters are always available. This is the only place vendor modules are
 * imported; everything else depends on the PaymentProvider interface.
 */

const providers: Record<PaymentGateway, PaymentProvider> = { paystack, flutterwave };

export function getPaymentProvider(gateway?: PaymentGateway): PaymentProvider {
  const choice = (gateway ?? (process.env.PAYMENT_PROVIDER as PaymentGateway) ?? "paystack");
  return providers[choice] ?? paystack;
}

export type { PaymentProvider } from "./types";
