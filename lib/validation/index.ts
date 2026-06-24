import type {
  CampRegistrationInput,
  AdmissionEnquiryInput,
  TourBookingInput,
  ContactMessageInput,
  NewsletterInput,
} from "../types";

/**
 * Dependency-free validators. Each returns a map of fieldErrors (empty =
 * valid) so server actions can surface inline messages. Swap for zod if
 * the form logic outgrows this — the call sites only read `fieldErrors`.
 */

export type FieldErrors = Record<string, string>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^[+]?[\d\s-]{7,}$/.test(v);
const nonEmpty = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export function validateCampRegistration(input: CampRegistrationInput): FieldErrors {
  const e: FieldErrors = {};
  if (!nonEmpty(input.campSlug)) e.campSlug = "Camp is required.";
  if (!input.sessionKeys?.length) e.sessionKeys = "Select at least one session.";
  if (!input.children?.length) e.children = "Add at least one child.";
  input.children?.forEach((c, i) => {
    if (!nonEmpty(c.name)) e[`children.${i}.name`] = "Child's name is required.";
    if (!nonEmpty(c.dateOfBirth)) e[`children.${i}.dateOfBirth`] = "Date of birth is required.";
  });
  if (!nonEmpty(input.guardian?.name)) e["guardian.name"] = "Guardian name is required.";
  if (!isEmail(input.guardian?.email ?? "")) e["guardian.email"] = "Valid email is required.";
  if (!isPhone(input.guardian?.phone ?? "")) e["guardian.phone"] = "Valid phone is required.";
  if (!nonEmpty(input.guardian?.emergencyPhone))
    e["guardian.emergencyPhone"] = "Emergency contact is required.";
  if (!input.consentAccepted) e.consentAccepted = "You must accept the policies to continue.";
  return e;
}

export function validateEnquiry(input: AdmissionEnquiryInput): FieldErrors {
  const e: FieldErrors = {};
  if (!nonEmpty(input.childName)) e.childName = "Child's name is required.";
  if (!nonEmpty(input.childAge)) e.childAge = "Child's age is required.";
  if (!nonEmpty(input.guardian?.name)) e["guardian.name"] = "Your name is required.";
  if (!isEmail(input.guardian?.email ?? "")) e["guardian.email"] = "Valid email is required.";
  if (!isPhone(input.guardian?.phone ?? "")) e["guardian.phone"] = "Valid phone is required.";
  return e;
}

export function validateTourBooking(input: TourBookingInput): FieldErrors {
  const e: FieldErrors = {};
  if (!nonEmpty(input.guardian?.name)) e["guardian.name"] = "Your name is required.";
  if (!isEmail(input.guardian?.email ?? "")) e["guardian.email"] = "Valid email is required.";
  if (!isPhone(input.guardian?.phone ?? "")) e["guardian.phone"] = "Valid phone is required.";
  if (!input.preferredDates?.length) e.preferredDates = "Pick at least one preferred date.";
  return e;
}

export function validateContact(input: ContactMessageInput): FieldErrors {
  const e: FieldErrors = {};
  if (!nonEmpty(input.name)) e.name = "Your name is required.";
  if (!isEmail(input.email ?? "")) e.email = "Valid email is required.";
  if (!nonEmpty(input.subject)) e.subject = "Subject is required.";
  if (!nonEmpty(input.message)) e.message = "Message is required.";
  return e;
}

export function validateNewsletter(input: NewsletterInput): FieldErrors {
  const e: FieldErrors = {};
  if (!isEmail(input.email ?? "")) e.email = "Valid email is required.";
  return e;
}
