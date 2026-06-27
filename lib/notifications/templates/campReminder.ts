import type { EmailBranding } from "../types";
import { emailLayout, h1, p, infoTable, divider } from "./layout";

export interface CampReminderVars {
  parentName:     string;
  childNames:     string;
  registrationId: string;
  daysUntilCamp:  7 | 3 | 1;
  campStartDate:  string;
  location:       string;
}

export function renderCampReminder(v: CampReminderVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const dayText = v.daysUntilCamp === 1 ? "Tomorrow" : `${v.daysUntilCamp} Days`;
  const content = `
    ${h1(`Camp Starts in ${dayText}! 🎉`, accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p(`The Future Makers Summer Experience 2026 is just around the corner! Camp starts in <strong>${v.daysUntilCamp === 1 ? "1 day" : `${v.daysUntilCamp} days`}</strong> — we are so excited to welcome ${v.childNames}!`)}
    ${infoTable([
      ["Child(ren)",       v.childNames],
      ["Registration ID", v.registrationId],
      ["Start Date",       v.campStartDate],
      ["Location",         v.location],
    ])}
    ${divider()}
    ${v.daysUntilCamp === 7 ? `
      ${h1("Quick Checklist", accent)}
      ${p("✓ Label all clothing and belongings with your child's name")}
      ${p("✓ Pack sunscreen, a reusable water bottle, and healthy snacks")}
      ${p("✓ Confirm your emergency contact number is up to date")}
    ` : ""}
    ${v.daysUntilCamp === 1 ? `
      ${p("<strong>Tomorrow's reminder:</strong> Please arrive at the venue 15 minutes early for check-in. Bring a photo ID.")}
    ` : ""}
    ${p("If you have any last-minute questions, please reply to this email or call us directly.")}
    ${p("See you soon!<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
