import "server-only";

/**
 * Team & customer notifications — a thin seam over whatever transport we
 * wire up later (Resend, Brevo, SMTP, or a WhatsApp Business API). Until
 * a provider key is set it no-ops with a server log, so flows work in dev
 * without external dependencies. Swap the body; call sites are unaffected.
 */

interface Notification {
  subject: string;
  body: string;
  /** Defaults to the centre's inbox (CONTACT_NOTIFY_EMAIL). */
  to?: string;
}

const FROM = process.env.NOTIFY_FROM_EMAIL;
const TEAM = process.env.CONTACT_NOTIFY_EMAIL;
const RESEND_KEY = process.env.RESEND_API_KEY;

export async function notifyTeam(n: Notification): Promise<void> {
  const to = n.to ?? TEAM;
  if (!RESEND_KEY || !FROM || !to) {
    console.info(`[notify:noop] ${n.subject}`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject: n.subject, text: n.body }),
    });
  } catch (err) {
    console.error("[notify] failed", err);
  }
}

/** Confirmation/receipt to a customer (camp registration, enquiry). */
export async function notifyCustomer(to: string, subject: string, body: string): Promise<void> {
  return notifyTeam({ to, subject, body });
}
