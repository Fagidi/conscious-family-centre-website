import "server-only";
import { createClient } from "next-sanity";
import type { Registration, RegistrationStats } from "./types";

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2025-01-01";

// Bypass CDN so admins always see the latest data
const adminClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

const FIELDS = `
  _id,
  registrationId,
  parentFullName,
  email,
  parentPhone,
  childrenFullNames,
  childrenAges,
  childOneGender,
  childTwoGender,
  tshirtSizes,
  nannyName,
  nannyPhone,
  emergencyContact,
  selectedMonths,
  selectedWeeks,
  selectedWeeksOther,
  paymentOption,
  status,
  paymentStatus,
  estimatedFee,
  submissionDate,
  cfcAttendanceHistory,
  adminNotes,
  electronicSignature,
  policyAgreement,
  googleSheetsSynced,
  googleSheetsSyncedAt,
  googleSheetsError,
  "paymentProofUrl": paymentProofFile.asset->url,
  timeline[] { title, timestamp, actor, note }
`;

export async function getAllRegistrations(): Promise<Registration[]> {
  if (!adminClient) return [];
  try {
    return await adminClient.fetch<Registration[]>(
      `*[_type == "futureMakersRegistration"] | order(submissionDate desc) { ${FIELDS} }`,
      {},
      { cache: "no-store" },
    );
  } catch {
    return [];
  }
}

export async function getRegistrationByDocId(docId: string): Promise<Registration | null> {
  if (!adminClient) return null;
  try {
    return await adminClient.fetch<Registration | null>(
      `*[_type == "futureMakersRegistration" && _id == $docId][0] { ${FIELDS} }`,
      { docId },
      { cache: "no-store" },
    );
  } catch {
    return null;
  }
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  if (!adminClient) return emptyStats();
  try {
    const s = await adminClient.fetch<RegistrationStats & { capacity: number | null }>(
      `{
        "total":                count(*[_type == "futureMakersRegistration"]),
        "pendingPayment":       count(*[_type == "futureMakersRegistration" && status == "pending-payment"]),
        "awaitingVerification": count(*[_type == "futureMakersRegistration" && status == "awaiting-verification"]),
        "confirmed":            count(*[_type == "futureMakersRegistration" && status == "confirmed"]),
        "checkedIn":            count(*[_type == "futureMakersRegistration" && status == "checked-in"]),
        "completed":            count(*[_type == "futureMakersRegistration" && status == "completed"]),
        "cancelled":            count(*[_type == "futureMakersRegistration" && status == "cancelled"]),
        "waitlist":             count(*[_type == "futureMakersRegistration" && status == "waitlist"]),
        "awaitingPaymentReview": count(*[_type == "futureMakersRegistration" && paymentStatus == "awaiting-review"]),
        "capacity": *[_type == "campSettings"][0].capacity
      }`,
      {},
      { cache: "no-store" },
    );
    return { ...s, capacity: s.capacity ?? 50 };
  } catch {
    return emptyStats();
  }
}

function emptyStats(): RegistrationStats {
  return {
    total: 0, pendingPayment: 0, awaitingVerification: 0,
    confirmed: 0, checkedIn: 0, completed: 0,
    cancelled: 0, waitlist: 0, awaitingPaymentReview: 0,
    capacity: 50,
  };
}
