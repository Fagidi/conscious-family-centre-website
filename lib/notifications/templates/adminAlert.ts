import type { AdminAlertType, EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, divider } from "./layout";

export interface AdminAlertVars {
  alertType:      AdminAlertType;
  registrationId: string;
  parentName?:    string;
  email?:         string;
  summary:        string;
  details?:       string;
  studioUrl?:     string;
}

const ALERT_LABELS: Record<AdminAlertType, string> = {
  "new-registration":     "New Registration",
  "payment-proof":        "Payment Proof Uploaded",
  "payment-verified":     "Payment Verified",
  "registration-cancelled":"Registration Cancelled",
  "capacity-warning":     "Capacity Warning",
  "camp-full":            "Camp is Now Full",
  "sheets-sync-failed":   "Google Sheets Sync Failed",
  "email-failed":         "Email Delivery Failed",
  "system-error":         "System Error",
};

export function renderAdminAlert(v: AdminAlertVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const label = ALERT_LABELS[v.alertType] ?? v.alertType;
  const rows: [string, string][] = [
    ["Alert Type", label],
    ["Registration ID", v.registrationId],
  ];
  if (v.parentName) rows.push(["Parent", v.parentName]);
  if (v.email)      rows.push(["Email",  v.email]);

  const content = `
    ${h1(`Admin Alert: ${label}`, accent)}
    ${p(v.summary)}
    ${infoTable(rows)}
    ${v.details ? `${divider()}${p(`<strong>Details:</strong><br/>${v.details.replace(/\n/g, "<br/>")}`)}` : ""}
    ${v.studioUrl ? `${divider()}${p(`<a href="${v.studioUrl}" style="color:${accent};font-weight:600">View in Sanity Studio →</a>`)}` : ""}
    ${divider()}
    ${p(`<em style="font-size:12px;color:#9ca3af">This is an automated alert from the Conscious Family Centre admin system.</em>`)}
  `;
  return emailLayout(content, branding);
}
