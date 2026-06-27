import type { EmailBranding } from "../types";
import { emailLayout, h1, p, divider } from "./layout";

export interface CompletionVars {
  parentName:     string;
  childNames:     string;
  registrationId: string;
}

export function renderCompletion(v: CompletionVars, branding: EmailBranding): string {
  const accent = branding.accentColor;
  const content = `
    ${h1("Thank You for a Wonderful Summer! 🌟", accent)}
    ${p(`Dear ${v.parentName},`)}
    ${p(`What a summer it has been! We are so grateful that <strong>${v.childNames}</strong> joined us for the Future Makers Summer Experience 2026. We hope they had an incredible time filled with learning, laughter, and new friendships.`)}
    ${divider()}
    ${p("We would love to hear about your experience! Your feedback helps us make future camps even better.")}
    ${p(`<a href="${branding.website}/feedback" style="color:${accent};font-weight:600">Share your feedback →</a>`)}
    ${divider()}
    ${p("Keep an eye on your inbox — we will be announcing our next programmes soon. We hope to see your family again!")}
    ${p("With gratitude,<br/><strong>The Conscious Family Centre Team</strong>")}
  `;
  return emailLayout(content, branding);
}
