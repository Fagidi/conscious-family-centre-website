/**
 * FUTURE MAKERS SUMMER EXPERIENCE 2026 — authoritative programme data.
 *
 * Sourced verbatim from the Conscious Family Centre Google Form / brief.
 * Nothing here is invented: fees, dates, age bands, inclusions and payment
 * details are exactly as provided. Where the brief gives no detail (some
 * policy wording), the text is an honest pointer to CFC, not a fabrication.
 */

import type { CampAgeOption, CampFeeGroup, CampMonths, CampWeeks } from "./types";

export const PROGRAMME = {
  name: "Future Makers Summer Experience 2026",
  centre: "Conscious Family Centre",
  location: "BMT Garden, Wuse 2, Abuja",
  datesLabel: "July & August 2026",
  hoursLabel: "Monday – Friday · 10:00am – 3:00pm",
  capacity: 50,
  earlyBirdUntilLabel: "Friday 3rd July 2026",
  depositDueLabel: "19 June 2026",
  rules: [
    "Places are limited to 50 children and allocated on a first-paid, first-served basis.",
    "Children under 4 years must attend with a parent or nanny.",
    "Children aged 4+ may attend independently.",
    "Children should bring their own lunch and water bottle.",
    "Daily attendance will be paused once programme spaces are filled.",
  ],
  subscriberNote:
    "Current monthly subscribers can continue with existing subscription plans throughout July and August, with the option to add extra field trips, activities, and clubs.",
} as const;

/** Programme highlights / what's included (verbatim from the brief). */
export const INCLUDES: string[] = [
  "Waka Wednesday Field Trips",
  "Chess Club (4+)",
  "French Club",
  "STEAM & Science Projects",
  "Arts & Crafts",
  "Jewellery Making",
  "Cooking & Life Skills",
  "Forest School & Outdoor Adventures",
  "Camping Experience",
  "Sensory Activities",
  "Future Makers Camp T-Shirt",
  "All Materials & Activities",
];

/** Bank transfer details (verbatim). */
export const PAYMENT = {
  accountName: "CONSCIOUS FAMILY LIMITED",
  accountNumber: "8035187384",
  bank: "Moniepoint",
} as const;

export const PAYMENT_OPTIONS = [
  { value: "full", label: "Full payment" },
  { value: "deposit", label: "50% non-refundable deposit" },
] as const;

/* ── Selection options ─────────────────────────────────────────── */

export const ATTENDANCE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "other-events", label: "I have attended other CFC events/programmes, but this is my first subscription" },
  { value: "no", label: "No" },
] as const;

export const AGE_OPTIONS: { value: CampAgeOption; label: string }[] = [
  { value: "0-18m", label: "0 - 18 months" },
  { value: "18m-2", label: "18 months - 2" },
  { value: "2-3", label: "2 - 3" },
  { value: "3-4", label: "3 - 4" },
  { value: "4-6", label: "4 - 6" },
  { value: "6-8", label: "6 - 8" },
  { value: "8-10", label: "8 - 10" },
  { value: "10+", label: "10+" },
];

export const TSHIRT_SIZES = [
  "0-2 years",
  "2–3 Years",
  "3–4 Years",
  "4–5 Years",
  "5–6 Years",
  "6–7 Years",
  "7–8 Years",
  "8–9 Years",
  "9–10 Years",
];

export const MONTH_OPTIONS: { value: CampMonths; label: string }[] = [
  { value: "july-august", label: "July & August" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
];

export const WEEK_OPTIONS: { value: CampWeeks; label: string }[] = [
  { value: "2", label: "2 weeks" },
  { value: "4", label: "4 weeks" },
  { value: "6", label: "6 weeks" },
  { value: "8", label: "8 weeks" },
  { value: "other", label: "Other" },
];

/* ── Fees (verbatim — only 2- and 4-week rates are defined) ─────── */

export const FEE_GROUPS: { group: CampFeeGroup; label: string; ageLabel: string; two: number; four: number }[] = [
  { group: "babies", label: "Babies", ageLabel: "0–18 Months", two: 90000, four: 180000 },
  { group: "toddlers", label: "Toddlers", ageLabel: "18 Months–3 Years", two: 130000, four: 260000 },
  { group: "early-explorers", label: "Early Explorers", ageLabel: "4–10 Years", two: 155000, four: 310000 },
];

const UNDER_4: CampAgeOption[] = ["0-18m", "18m-2", "2-3", "3-4"];

export function ageIsUnder4(age: CampAgeOption | undefined): boolean {
  return !!age && UNDER_4.includes(age);
}

export function feeGroupForAge(age: CampAgeOption): CampFeeGroup {
  if (age === "0-18m") return "babies";
  if (age === "18m-2" || age === "2-3" || age === "3-4") return "toddlers";
  return "early-explorers";
}

/**
 * Suggested fee from the published table. Only 2- and 4-week durations have a
 * defined rate; anything else returns null → "Fee to be confirmed by CFC".
 */
export function estimateFee(age: CampAgeOption | undefined, weeks: CampWeeks | undefined): number | null {
  if (!age || !weeks) return null;
  const row = FEE_GROUPS.find((g) => g.group === feeGroupForAge(age));
  if (!row) return null;
  if (weeks === "2") return row.two;
  if (weeks === "4") return row.four;
  return null;
}

/* ── Policies (facts from the brief; honest pointers where unstated) ── */

export const POLICIES: { title: string; body: string }[] = [
  {
    title: "Registration & Payment",
    body: "Places are limited to 50 children and allocated on a first-paid, first-served basis. Registration is only confirmed once payment has been received. You may pay in full, or pay a 50% non-refundable deposit (due 19 June 2026) with the balance payable before your child's first day.",
  },
  {
    title: "Refund & Cancellation Policy",
    body: "The 50% deposit is non-refundable. For any other refund or cancellation questions, please contact Conscious Family Centre.",
  },
  {
    title: "Damage Fee",
    body: "Any applicable damage fee will be confirmed by Conscious Family Centre.",
  },
  {
    title: "Late Pick-Up Policy",
    body: "Programme hours are Monday–Friday, 10:00am–3:00pm. Late pick-up arrangements will be confirmed by Conscious Family Centre.",
  },
  {
    title: "Sick Child Policy",
    body: "If your child is unwell, please keep them at home. Full details will be provided by Conscious Family Centre.",
  },
  {
    title: "What to Bring",
    body: "Children should bring their own lunch and a water bottle. All activity materials are provided.",
  },
  {
    title: "Behaviour Policy",
    body: "Our approach to behaviour and wellbeing will be shared by Conscious Family Centre.",
  },
  {
    title: "Photography & Media Consent",
    body: "Photographs and media may be taken during activities. Please contact Conscious Family Centre about any media preferences.",
  },
];
