import type { EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, divider } from "./layout";

export interface RejectedVars {
  parentName:     string;
  childNames:     string;
  registrationId: string;
  reason?:        string;
}

export function renderRejected(v: RejectedVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const content = `
    ${h1("Registration Update", accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p("Thank you for your interest in the <strong>Future Makers Summer Experience 2026</strong>. After reviewing your registration, we are unable to confirm your child's place at this time.")}
    ${infoTable([
      ["Registration ID", v.registrationId],
      ["Child(ren)",       v.childNames],
    ])}
    ${v.reason ? `${divider()}${p(`<strong>Reason:</strong> ${v.reason}`)}` : ""}
    ${divider()}
    ${p("If you believe this is an error, or if you would like to discuss alternative options, please reply to this email and we will do our best to assist you.")}
    ${p("We apologise for any disappointment and hope to welcome your family to a future Conscious Family Centre event.")}
    ${p("Warmly,<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
