import type { EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, divider } from "./layout";

export interface PaymentReminderVars {
  parentName:     string;
  registrationId: string;
  amountDue:      string;
  dueDate:        string;
}

export function renderPaymentReminder(v: PaymentReminderVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const content = `
    ${h1("Payment Reminder", accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p("This is a friendly reminder that payment is outstanding for your Future Makers Summer Experience 2026 registration. Your place will not be confirmed until payment is received.")}
    ${infoTable([
      ["Registration ID", v.registrationId],
      ["Amount Due",       v.amountDue],
      ["Due Date",         v.dueDate],
    ])}
    ${divider()}
    ${p("To secure your child's place, please make payment and upload your proof of payment at <a href=\"" + branding.website + "/register\" style=\"color:" + accent + "\">" + branding.website + "/register</a>.")}
    ${p("If you have already made payment and uploaded proof, please disregard this message — our team will verify it shortly.")}
    ${p("If you have questions, please reply to this email.")}
    ${p("Warmly,<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
