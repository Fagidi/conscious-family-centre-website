import type { EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, button, divider } from "./layout";

export interface ConfirmationVars {
  parentName:    string;
  childNames:    string;
  registrationId:string;
  programme:     string;
  fee:           string;
  paymentOption: string;
}

export function renderConfirmation(v: ConfirmationVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const content = `
    ${h1("Registration Received!", accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p("Thank you for registering for the <strong>Future Makers Summer Experience 2026</strong>! We have received your registration and proof of payment.")}
    ${infoTable([
      ["Registration ID", v.registrationId],
      ["Child(ren)",       v.childNames],
      ["Programme",        v.programme],
      ["Payment Option",   v.paymentOption],
      ["Estimated Fee",    v.fee],
    ])}
    ${divider()}
    ${h1("What Happens Next", accent)}
    ${p("<strong>1.</strong> Our team will review your registration and proof of payment.")}
    ${p("<strong>2.</strong> You will receive a confirmation email once your place is secured.")}
    ${p("<strong>3.</strong> Your place is only confirmed after payment has been verified.", true)}
    ${divider()}
    ${p(`If you have any questions, please reply to this email or contact us at ${branding.schoolAddress}.`)}
    ${p("Warmly,<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
