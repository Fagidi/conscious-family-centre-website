import "server-only";
import type { EmailResult, TemplateKey, AdminAlertType } from "./types";
import { sendEmail } from "./providers";
import { logEmail } from "./logger";
import { getEmailBranding } from "./branding";
import { getNotificationSettings } from "./settings";
import {
  renderConfirmation,
  renderApproved,
  renderRejected,
  renderPaymentReminder,
  renderCampReminder,
  renderCompletion,
  renderAdminAlert,
  renderSample,
} from "./templates";

// Lightweight registration shape the service needs
export interface RegData {
  registrationId:  string;
  email:           string;
  parentFullName:  string;
  childrenFullNames:string;
  childrenAges?:   string;
  selectedWeeks?:  string;
  selectedMonths?: string;
  paymentOption?:  string;
  estimatedFee?:   number;
}

async function send(
  to: string,
  subject: string,
  html: string,
  templateKey: TemplateKey,
  registrationId?: string,
): Promise<EmailResult> {
  const result = await sendEmail({ to, subject, html });
  const emailResult: EmailResult = {
    ok:          result.ok,
    status:      result.status,
    messageId:   result.messageId,
    error:       result.error,
    templateKey,
    recipient:   to,
  };
  await logEmail({ result: emailResult, registrationId });
  return emailResult;
}

function feeLabel(reg: RegData): string {
  return reg.estimatedFee != null
    ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(reg.estimatedFee)
    : "Fee to be confirmed";
}

function programme(reg: RegData): string {
  return [reg.selectedWeeks, reg.selectedMonths].filter(Boolean).join(" · ") || "Future Makers 2026";
}

export const NotificationService = {
  async sendRegistrationConfirmation(reg: RegData): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.confirmationEmail) {
      return { ok: true, status: "disabled", templateKey: "confirmation", recipient: reg.email };
    }
    const subject = settings.subjectConfirmation ?? `Your Future Makers 2026 registration — ${reg.registrationId}`;
    const html = renderConfirmation({
      parentName:     reg.parentFullName,
      childNames:     reg.childrenFullNames,
      registrationId: reg.registrationId,
      programme:      programme(reg),
      fee:            feeLabel(reg),
      paymentOption:  reg.paymentOption ?? "—",
    }, branding);
    return send(reg.email, subject, html, "confirmation", reg.registrationId);
  },

  async sendAdminNotification(alertType: AdminAlertType, reg: RegData, extraDetails?: string): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    const adminEmail = process.env.BREVO_ADMIN_NOTIFICATION_EMAIL ?? process.env.CONTACT_NOTIFY_EMAIL ?? "";
    if (!adminEmail) {
      console.info("[notifications] no admin email configured — skipping admin alert");
      return { ok: true, status: "disabled", templateKey: "admin-alert", recipient: "" };
    }
    if (alertType === "new-registration" && !settings.adminNewRegistration)
      return { ok: true, status: "disabled", templateKey: "admin-alert", recipient: adminEmail };

    const studioUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
      : undefined;

    const html = renderAdminAlert({
      alertType,
      registrationId: reg.registrationId,
      parentName:     reg.parentFullName,
      email:          reg.email,
      summary:        `${alertType.replace(/-/g, " ")} — ${reg.registrationId}`,
      details:        extraDetails,
      studioUrl,
    }, branding);
    return send(adminEmail, `CFC Admin: ${alertType} — ${reg.registrationId}`, html, "admin-alert", reg.registrationId);
  },

  async sendRegistrationApproved(reg: RegData, notes?: string): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.approvedEmail)
      return { ok: true, status: "disabled", templateKey: "approved", recipient: reg.email };
    const subject = settings.subjectApproved ?? `Great news! Your Future Makers place is confirmed — ${reg.registrationId}`;
    const html = renderApproved({
      parentName:     reg.parentFullName,
      childNames:     reg.childrenFullNames,
      registrationId: reg.registrationId,
      programme:      programme(reg),
      notes,
    }, branding);
    return send(reg.email, subject, html, "approved", reg.registrationId);
  },

  async sendRegistrationRejected(reg: RegData, reason?: string): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.rejectedEmail)
      return { ok: true, status: "disabled", templateKey: "rejected", recipient: reg.email };
    const subject = settings.subjectRejected ?? `Update on your Future Makers registration — ${reg.registrationId}`;
    const html = renderRejected({
      parentName:     reg.parentFullName,
      childNames:     reg.childrenFullNames,
      registrationId: reg.registrationId,
      reason,
    }, branding);
    return send(reg.email, subject, html, "rejected", reg.registrationId);
  },

  async sendPaymentReminder(reg: RegData, dueDate = "as soon as possible"): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.paymentReminderEmail)
      return { ok: true, status: "disabled", templateKey: "payment-reminder", recipient: reg.email };
    const subject = settings.subjectPaymentReminder ?? `Payment reminder — ${reg.registrationId}`;
    const html = renderPaymentReminder({
      parentName:     reg.parentFullName,
      registrationId: reg.registrationId,
      amountDue:      feeLabel(reg),
      dueDate,
    }, branding);
    return send(reg.email, subject, html, "payment-reminder", reg.registrationId);
  },

  async sendCampReminder(reg: RegData, daysAhead: 7 | 3 | 1, campStartDate: string, location?: string): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.campReminderEmail)
      return { ok: true, status: "disabled", templateKey: "camp-reminder", recipient: reg.email };
    const subject = settings.subjectCampReminder ?? `Camp starts in ${daysAhead} day${daysAhead > 1 ? "s" : ""}! — ${reg.registrationId}`;
    const html = renderCampReminder({
      parentName:     reg.parentFullName,
      childNames:     reg.childrenFullNames,
      registrationId: reg.registrationId,
      daysUntilCamp:  daysAhead,
      campStartDate,
      location:       location ?? "Conscious Family Centre, Wuse 2, Abuja",
    }, branding);
    return send(reg.email, subject, html, "camp-reminder", reg.registrationId);
  },

  async sendCompletionEmail(reg: RegData): Promise<EmailResult> {
    const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
    if (!settings.completionEmail)
      return { ok: true, status: "disabled", templateKey: "completion", recipient: reg.email };
    const subject = settings.subjectCompletion ?? `Thank you for a wonderful summer! — ${reg.registrationId}`;
    const html = renderCompletion({
      parentName:     reg.parentFullName,
      childNames:     reg.childrenFullNames,
      registrationId: reg.registrationId,
    }, branding);
    return send(reg.email, subject, html, "completion", reg.registrationId);
  },

  async sendTestEmail(templateKey: TemplateKey, to: string): Promise<EmailResult> {
    const branding = await getEmailBranding();
    const html = renderSample(templateKey, branding);
    return send(to, `[TEST] ${templateKey} — Conscious Family Centre`, html, templateKey);
  },
};
