import type { EmailBranding, TemplateKey } from "../types";
import { renderConfirmation, ConfirmationVars } from "./confirmation";
import { renderApproved, ApprovedVars } from "./approved";
import { renderRejected, RejectedVars } from "./rejected";
import { renderPaymentReminder, PaymentReminderVars } from "./paymentReminder";
import { renderCampReminder, CampReminderVars } from "./campReminder";
import { renderCompletion, CompletionVars } from "./completion";
import { renderAdminAlert, AdminAlertVars } from "./adminAlert";

export type {
  ConfirmationVars,
  ApprovedVars,
  RejectedVars,
  PaymentReminderVars,
  CampReminderVars,
  CompletionVars,
  AdminAlertVars,
};

export {
  renderConfirmation,
  renderApproved,
  renderRejected,
  renderPaymentReminder,
  renderCampReminder,
  renderCompletion,
  renderAdminAlert,
};

export interface SampleVars {
  parentName: string;
  childName:  string;
  regId:      string;
  email:      string;
  programme:  string;
  fee:        string;
}

export const SAMPLE: SampleVars = {
  parentName: "Amara Okafor",
  childName:  "Zara Okafor",
  regId:      "CFC-2026-ZAR-OKA-0001",
  email:      "amara@example.com",
  programme:  "4 weeks · July & August",
  fee:        "₦180,000",
};

export function renderSample(key: TemplateKey, branding: EmailBranding): string {
  const v = SAMPLE;
  switch (key) {
    case "confirmation":
      return renderConfirmation({ parentName: v.parentName, childNames: v.childName, registrationId: v.regId, programme: v.programme, fee: v.fee, paymentOption: "Full payment" }, branding);
    case "approved":
      return renderApproved({ parentName: v.parentName, childNames: v.childName, registrationId: v.regId, programme: v.programme }, branding);
    case "rejected":
      return renderRejected({ parentName: v.parentName, childNames: v.childName, registrationId: v.regId, reason: "Unfortunately the selected programme is now full." }, branding);
    case "payment-reminder":
      return renderPaymentReminder({ parentName: v.parentName, registrationId: v.regId, amountDue: v.fee, dueDate: "15 July 2026" }, branding);
    case "camp-reminder":
      return renderCampReminder({ parentName: v.parentName, childNames: v.childName, registrationId: v.regId, daysUntilCamp: 7, campStartDate: "21 July 2026", location: "Conscious Family Centre, Wuse 2" }, branding);
    case "completion":
      return renderCompletion({ parentName: v.parentName, childNames: v.childName, registrationId: v.regId }, branding);
    case "admin-alert":
      return renderAdminAlert({ alertType: "new-registration", registrationId: v.regId, parentName: v.parentName, email: v.email, summary: "New registration submitted via website" }, branding);
    default:
      return `<p>No preview available for template: ${key}</p>`;
  }
}
