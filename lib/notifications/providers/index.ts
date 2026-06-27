import { sendViaBrevo } from "./brevo";
import type { SendEmailParams, EmailStatus } from "../types";

export interface ProviderResult { ok: boolean; status: EmailStatus; messageId?: string; error?: string }

export async function sendEmail(params: SendEmailParams): Promise<ProviderResult> {
  // Future: switch on config to select provider
  return sendViaBrevo(params);
}
