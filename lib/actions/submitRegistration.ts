"use server";

import { writeClient } from "../sanity/client";
import { registrationSchema } from "../validation/registration";
import { estimateFee } from "../futureMakers";
import { NotificationService } from "../notifications/service";
import { appendRegistrationRow } from "../sheets";
import { formatNaira } from "../utils";
import type { ActionResult, CampAgeOption, CampWeeks } from "../types";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export interface RegistrationResult {
  registrationId: string;
  estimatedFee: number | null;
  feeLabel: string;
}

const AGE_LABEL: Record<CampAgeOption, string> = {
  "0-18m":  "0 – 18 months",
  "18m-2":  "18 months – 2",
  "2-3":    "2 – 3",
  "3-4":    "3 – 4",
  "4-6":    "4 – 6",
  "6-8":    "6 – 8",
  "8-10":   "8 – 10",
  "10+":    "10+",
};

const WEEK_LABEL: Record<CampWeeks, string> = {
  "2": "2 weeks",
  "4": "4 weeks",
  "6": "6 weeks",
  "8": "8 weeks",
  other: "Other",
};

const MONTH_LABEL: Record<string, string> = {
  "july-august": "July & August",
  "july":        "July",
  "august":      "August",
};

const PAYMENT_OPTION_LABEL: Record<string, string> = {
  "full":    "Full payment",
  "deposit": "50% non-refundable deposit",
};

// ── Registration ID ──────────────────────────────────────────────────────────

function extractNameCodes(childrenFullNames: string): { first: string; last: string } {
  const firstName = (childrenFullNames ?? "").split(",")[0].trim();
  const parts = firstName.split(/\s+/).filter(Boolean);
  const raw1 = (parts[0] ?? "").toUpperCase().replace(/[^A-Z]/g, "");
  const raw2 = (parts[parts.length - 1] ?? "").toUpperCase().replace(/[^A-Z]/g, "");
  return {
    first: raw1.slice(0, 3).padEnd(3, "X"),
    last:  (parts.length > 1 ? raw2 : "XXX").slice(0, 3).padEnd(3, "X"),
  };
}

async function buildRegistrationId(childrenFullNames: string): Promise<string> {
  const { first, last } = extractNameCodes(childrenFullNames);
  let seq = 1;
  if (writeClient) {
    try {
      const count = await writeClient.fetch<number>(`count(*[_type == "futureMakersRegistration"])`);
      seq = (count ?? 0) + 1;
    } catch {
      seq = Date.now() % 9000 + 1000;
    }
  }
  return `CFC-2026-${first}-${last}-${String(seq).padStart(4, "0")}`;
}

// ── Timeline helpers ─────────────────────────────────────────────────────────

interface TimelineEvent {
  _key: string;
  _type: "timelineEvent";
  title: string;
  timestamp: string;
  actor: string;
  note?: string;
}

function mkEvent(title: string, actor: string, note?: string): TimelineEvent {
  return {
    _key: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    _type: "timelineEvent",
    title,
    timestamp: new Date().toISOString(),
    actor,
    note,
  };
}

// ── Server action ────────────────────────────────────────────────────────────

/**
 * Submit a Future Makers registration.
 *
 * Order of operations (Sanity is authoritative):
 *  1. Validate proof of payment (file type / size)
 *  2. Validate all form fields (Zod)
 *  3. Generate Registration ID
 *  4. Upload proof to Sanity assets
 *  5. Create registration document (with initial timeline event)
 *  6. Send confirmation email to parent
 *  7. Send notification email to admin team
 *  8. Append row to Google Sheets (best-effort)
 *  9. Patch Sanity document with Sheets sync result + email events
 */
export async function submitRegistration(formData: FormData): Promise<ActionResult<RegistrationResult>> {
  // 1. Validate proof
  const file = formData.get("proof");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please upload your proof of payment.", fieldErrors: { proof: "Proof of payment is required." } };
  }
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    return { ok: false, error: "Proof must be an image or PDF.", fieldErrors: { proof: "Please upload an image or PDF." } };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "File is too large (max 10MB).", fieldErrors: { proof: "Maximum file size is 10MB." } };
  }

  // 2. Validate form fields
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

  const data      = parsed.data;
  const submittedAt = new Date().toISOString();
  const fee       = estimateFee(data.childrenAges as CampAgeOption, data.selectedWeeks as CampWeeks);
  const feeLabel  = fee !== null ? formatNaira(fee) : "Fee to be confirmed by Conscious Family Centre";
  const months    = MONTH_LABEL[data.selectedMonths] ?? data.selectedMonths;
  const weeks     = WEEK_LABEL[data.selectedWeeks as CampWeeks];

  // 3. Generate Registration ID
  const registrationId = await buildRegistrationId(data.childrenFullNames);

  // 4+5. Upload proof + save registration document
  let sanityDocId: string | null = null;
  if (writeClient) {
    try {
      const asset = await writeClient.assets.upload(
        "file",
        Buffer.from(await file.arrayBuffer()),
        { filename: `${registrationId}-${file.name}`, contentType: file.type },
      );

      const doc = await writeClient.create({
        _type: "futureMakersRegistration",
        registrationId,
        submissionDate: submittedAt,
        status:        "awaiting-verification",
        paymentStatus: "awaiting-review",
        email:               data.email,
        parentFullName:      data.parentFullName,
        parentPhone:         data.parentPhone,
        cfcAttendanceHistory: data.cfcAttendanceHistory,
        childrenFullNames:   data.childrenFullNames,
        childrenAges:        AGE_LABEL[data.childrenAges as CampAgeOption],
        childOneGender:      data.childOneGender,
        childTwoGender:      data.childTwoGender || undefined,
        tshirtSizes:         data.tshirtSizes.join(", "),
        nannyName:           data.nannyName || undefined,
        nannyPhone:          data.nannyPhone || undefined,
        selectedMonths:      months,
        selectedWeeks:       weeks,
        selectedWeeksOther:  data.selectedWeeksOther || undefined,
        paymentOption:       PAYMENT_OPTION_LABEL[data.paymentOption] ?? data.paymentOption,
        emergencyContact:    data.emergencyContact,
        electronicSignature: data.electronicSignature,
        policyAgreement:     data.policyAgreement,
        estimatedFee:        fee ?? undefined,
        paymentProofFile:    { _type: "file", asset: { _type: "reference", _ref: asset._id } },
        timeline: [
          mkEvent("Registration Submitted", "Parent",  `Submitted via website. Proof of payment: ${file.name}`),
          mkEvent("Payment Proof Uploaded",  "System",  `Proof stored as ${registrationId}-${file.name}`),
        ],
      });

      sanityDocId = doc._id;
    } catch (err) {
      console.error("[registration] Sanity save failed", err);
      return { ok: false, error: "We couldn't save your registration. Please try again or contact us." };
    }
  }

  // 6. Confirmation email to parent
  const regData = {
    registrationId,
    email:             data.email,
    parentFullName:    data.parentFullName,
    childrenFullNames: data.childrenFullNames,
    childrenAges:      AGE_LABEL[data.childrenAges as CampAgeOption],
    selectedWeeks:     weeks,
    selectedMonths:    months,
    paymentOption:     PAYMENT_OPTION_LABEL[data.paymentOption] ?? data.paymentOption,
    estimatedFee:      fee ?? undefined,
  };
  await NotificationService.sendRegistrationConfirmation(regData);

  // 7. Admin notification email
  await NotificationService.sendAdminNotification("new-registration", regData);

  // 8. Google Sheets sync (best-effort — never fails the registration)
  let sheetsSynced  = false;
  let sheetsError: string | undefined;
  let sheetsSyncedAt: string | undefined;

  const sheetsResult = await appendRegistrationRow({
    registrationId,
    timestamp:       submittedAt,
    status:          "Awaiting Verification",
    paymentStatus:   "Awaiting Review",
    email:           data.email,
    parentFullName:  data.parentFullName,
    parentPhone:     data.parentPhone,
    attendanceHistory: data.cfcAttendanceHistory,
    childrenFullNames: data.childrenFullNames,
    childrenAges:    AGE_LABEL[data.childrenAges as CampAgeOption],
    childOneGender:  data.childOneGender,
    childTwoGender:  data.childTwoGender ?? "",
    tshirtSizes:     data.tshirtSizes.join(", "),
    nannyName:       data.nannyName ?? "",
    nannyPhone:      data.nannyPhone ?? "",
    selectedMonths:  months,
    selectedWeeks:   weeks,
    emergencyContact: data.emergencyContact,
    estimatedFee:    fee ?? "",
    electronicSignature: data.electronicSignature,
    adminNotes:      "",
  });

  sheetsSynced  = sheetsResult.ok;
  sheetsError   = sheetsResult.ok ? undefined : (sheetsResult.error ?? "unknown");
  sheetsSyncedAt = sheetsResult.ok ? new Date().toISOString() : undefined;

  // 9. Patch Sanity doc with downstream results (fire-and-forget)
  if (writeClient && sanityDocId) {
    const extraEvents: TimelineEvent[] = [];

    extraEvents.push(
      mkEvent("Confirmation Email Sent", "System", `Sent to ${data.email}`),
      mkEvent("Admin Notification Sent", "System",  "Team notified"),
    );

    if (sheetsSynced) {
      extraEvents.push(mkEvent("Google Sheets Synced", "System", "Row appended successfully"));
    } else {
      extraEvents.push(mkEvent("Google Sheets Sync Failed", "System", sheetsError));
    }

    writeClient
      .patch(sanityDocId)
      .setIfMissing({ timeline: [] })
      .append("timeline", extraEvents)
      .set({
        googleSheetsSynced:   sheetsSynced,
        ...(sheetsSyncedAt ? { googleSheetsSyncedAt: sheetsSyncedAt } : {}),
        ...(sheetsError     ? { googleSheetsError:   sheetsError }    : {}),
      })
      .commit()
      .catch((err: unknown) => console.error("[registration] timeline patch failed", err));
  }

  return { ok: true, data: { registrationId, estimatedFee: fee, feeLabel } };
}
