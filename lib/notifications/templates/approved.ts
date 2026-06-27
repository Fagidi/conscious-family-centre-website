import type { EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, divider } from "./layout";

export interface ApprovedVars {
  parentName:     string;
  childNames:     string;
  registrationId: string;
  programme:      string;
  notes?:         string;
}

export function renderApproved(v: ApprovedVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const content = `
    ${h1("Your Place is Confirmed!", accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p("Great news! We have reviewed your payment and your registration for the <strong>Future Makers Summer Experience 2026</strong> is now <strong>confirmed</strong>.")}
    ${infoTable([
      ["Registration ID", v.registrationId],
      ["Child(ren)",       v.childNames],
      ["Programme",        v.programme],
      ["Status",           "✓ Confirmed"],
    ])}
    ${v.notes ? `${divider()}${p(`<strong>Note from our team:</strong> ${v.notes}`)}` : ""}
    ${divider()}
    ${p("We will be in touch closer to the camp start date with important details including drop-off times, what to bring, and the daily schedule.")}
    ${p("We look forward to welcoming your child(ren) to the Future Makers family!")}
    ${p("Warmly,<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
