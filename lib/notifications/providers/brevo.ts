import type { SendEmailParams, EmailStatus } from "../types";

interface BrevoResult { ok: boolean; messageId?: string; error?: string; status: EmailStatus }

export async function sendViaBrevo(params: SendEmailParams): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.info(`[brevo:noop] ${params.subject} → ${params.to}`);
    return { ok: true, status: "no-provider" };
  }

  const senderName  = process.env.BREVO_SENDER_NAME  ?? params.from ?? "Conscious Family Centre";
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? params.from ?? "hello@consciousfamilycentre.com";
  const replyTo     = process.env.BREVO_REPLY_TO     ?? params.replyTo ?? senderEmail;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key":     apiKey,
        "Content-Type": "application/json",
        Accept:        "application/json",
      },
      body: JSON.stringify({
        sender:    { name: senderName, email: senderEmail },
        to:        [{ email: params.to }],
        replyTo:   { email: replyTo },
        subject:   params.subject,
        htmlContent: params.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, status: "failed", error: `Brevo ${res.status}: ${body}` };
    }

    const data = await res.json() as { messageId?: string };
    return { ok: true, status: "sent", messageId: data.messageId };
  } catch (err) {
    return { ok: false, status: "failed", error: err instanceof Error ? err.message : String(err) };
  }
}
