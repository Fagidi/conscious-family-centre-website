"use server";

import { writeClient } from "../sanity/client";
import { registrationSchema } from "../validation/registration";
import { estimateFee } from "../futureMakers";
import { notifyTeam, notifyCustomer } from "../notify";
import { appendRegistrationRow } from "../sheets";
import { formatNaira } from "../utils";
import type { ActionResult, CampAgeOption, CampWeeks } from "../types";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export interface RegistrationResult {
  registrationId: string;
  estimatedFee: number | null;
  feeLabel: string;
}

function newRegistrationId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const time = Date.now().toString(36).slice(-3).toUpperCase();
  return `FM2026-${rand}${time}`;
}

const AGE_LABEL: Record<CampAgeOption, string> = {
  "0-18m": "0 - 18 months",
  "18m-2": "18 months - 2",
  "2-3": "2 - 3",
  "3-4": "3 - 4",
  "4-6": "4 - 6",
  "6-8": "6 - 8",
  "8-10": "8 - 10",
  "10+": "10+",
};
const WEEK_LABEL: Record<CampWeeks, string> = { "2": "2 weeks", "4": "4 weeks", "6": "6 weeks", "8": "8 weeks", other: "Other" };

/**
 * Submit a Future Makers registration. Order of operations (Sanity is the
 * source of truth; downstream steps are best-effort and never fail the save):
 *  1. Validate fields (Zod) + the uploaded proof (type/size)
 *  2. Upload proof to Sanity assets
 *  3. Create the registration document
 *  4. Email the parent (confirmation) + the team (notification)
 *  5. Append a row to the Google Sheet (logged + retryable on failure)
 */
export async function submitRegistration(formData: FormData): Promise<ActionResult<RegistrationResult>> {
  // 1a. Validate the proof of payment.
  const file = formData.get("proof");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please upload your proof of payment.", fieldErrors: { proof: "Proof of payment is required." } };
  }
  const validType = file.type.startsWith("image/") || file.type === "application/pdf";
  if (!validType) {
    return { ok: false, error: "Proof must be an image or PDF.", fieldErrors: { proof: "Please upload an image or PDF." } };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "File is too large (max 10MB).", fieldErrors: { proof: "Maximum file size is 10MB." } };
  }

  // 1b. Validate the form fields.
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("data") ?? "{}"));
  } catch {
    return { ok: false, error: "Something went wrong reading your details. Please try again." };
  }
  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please review the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const registrationId = newRegistrationId();
  const submittedAt = new Date().toISOString();
  const fee = estimateFee(data.childrenAges as CampAgeOption, data.selectedWeeks as CampWeeks);
  const feeLabel = fee !== null ? formatNaira(fee) : "Fee to be confirmed by Conscious Family Centre";

  // 2 + 3. Upload proof and persist the registration (Sanity is authoritative).
  if (writeClient) {
    try {
      const asset = await writeClient.assets.upload("file", Buffer.from(await file.arrayBuffer()), {
        filename: `${registrationId}-${file.name}`,
        contentType: file.type,
      });
      await writeClient.create({
        _type: "futureMakersRegistration",
        registrationId,
        submissionDate: submittedAt,
        status: "pending-review",
        paymentStatus: "awaiting-review",
        email: data.email,
        parentFullName: data.parentFullName,
        parentPhone: data.parentPhone,
        cfcAttendanceHistory: data.cfcAttendanceHistory,
        childrenFullNames: data.childrenFullNames,
        childrenAges: AGE_LABEL[data.childrenAges as CampAgeOption],
        childOneGender: data.childOneGender,
        childTwoGender: data.childTwoGender || undefined,
        tshirtSize: data.tshirtSize,
        nannyName: data.nannyName || undefined,
        nannyPhone: data.nannyPhone || undefined,
        selectedMonths: data.selectedMonths,
        selectedWeeks: WEEK_LABEL[data.selectedWeeks as CampWeeks],
        selectedWeeksOther: data.selectedWeeksOther || undefined,
        paymentOption: data.paymentOption,
        emergencyContact: data.emergencyContact,
        electronicSignature: data.electronicSignature,
        policyAgreement: data.policyAgreement,
        estimatedFee: fee ?? undefined,
        paymentProofFile: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
      });
    } catch (err) {
      console.error("[registration] Sanity save failed", err);
      return { ok: false, error: "We couldn't save your registration. Please try again or contact us." };
    }
  }

  // 4. Emails (no-op until a provider key is set).
  const programmeLine = `${WEEK_LABEL[data.selectedWeeks as CampWeeks]} · ${
    data.selectedMonths === "july-august" ? "July & August" : data.selectedMonths === "july" ? "July" : "August"
  }`;
  await notifyCustomer(
    data.email,
    `Future Makers 2026 — registration received (${registrationId})`,
    [
      `Hi ${data.parentFullName},`,
      "",
      "Thank you for registering for the Future Makers Summer Experience 2026.",
      `Registration ID: ${registrationId}`,
      `Programme: ${programmeLine}`,
      `Estimated fee: ${feeLabel}`,
      "",
      "Please note: your place is only confirmed once we have reviewed and received your payment. We'll be in touch shortly.",
      "",
      "Warmly,",
      "Conscious Family Centre",
    ].join("\n"),
  );
  await notifyTeam({
    subject: `New Future Makers registration: ${data.parentFullName} (${registrationId})`,
    body: [
      `Registration ID: ${registrationId}`,
      `Parent: ${data.parentFullName} — ${data.email} / ${data.parentPhone}`,
      `Attendance history: ${data.cfcAttendanceHistory}`,
      `Children: ${data.childrenFullNames} (${AGE_LABEL[data.childrenAges as CampAgeOption]})`,
      `Programme: ${programmeLine}`,
      `Payment option: ${data.paymentOption}`,
      `Estimated fee: ${feeLabel}`,
      `Emergency contact: ${data.emergencyContact}`,
      writeClient ? "Proof of payment uploaded to Sanity." : "Sanity disabled — proof not stored.",
    ].join("\n"),
  });

  // 5. Best-effort Google Sheets sync.
  await appendRegistrationRow({
    registrationId,
    timestamp: submittedAt,
    status: "Pending Review",
    paymentStatus: "Awaiting Review",
    email: data.email,
    parentFullName: data.parentFullName,
    parentPhone: data.parentPhone,
    attendanceHistory: data.cfcAttendanceHistory,
    childrenFullNames: data.childrenFullNames,
    childrenAges: AGE_LABEL[data.childrenAges as CampAgeOption],
    childOneGender: data.childOneGender,
    childTwoGender: data.childTwoGender ?? "",
    tshirtSize: data.tshirtSize,
    nannyName: data.nannyName ?? "",
    nannyPhone: data.nannyPhone ?? "",
    selectedMonths: data.selectedMonths,
    selectedWeeks: WEEK_LABEL[data.selectedWeeks as CampWeeks],
    emergencyContact: data.emergencyContact,
    estimatedFee: fee ?? "",
    electronicSignature: data.electronicSignature,
    adminNotes: "",
  });

  return { ok: true, data: { registrationId, estimatedFee: fee, feeLabel } };
}
