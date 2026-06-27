import "server-only";
import { fetchWithFallback } from "@/lib/sanity/client";
import type { NotificationSettings } from "./types";

const DEFAULT: NotificationSettings = {
  confirmationEmail:        true,
  approvedEmail:            true,
  rejectedEmail:            true,
  paymentReminderEmail:     true,
  paymentReceivedEmail:     true,
  campReminderEmail:        true,
  completionEmail:          true,
  adminNewRegistration:     true,
  adminPaymentProof:        true,
  adminPaymentVerification: true,
  adminCancelled:           true,
  adminCapacityWarning:     true,
  adminCampFull:            true,
  adminSheetsSyncFailed:    true,
  adminEmailFailed:         true,
  adminSystemErrors:        true,
};

const QUERY = `*[_type == "notificationSettings"][0]{
  confirmationEmail, approvedEmail, rejectedEmail, paymentReminderEmail, paymentReceivedEmail,
  campReminderEmail, completionEmail,
  adminNewRegistration, adminPaymentProof, adminPaymentVerification, adminCancelled,
  adminCapacityWarning, adminCampFull, adminSheetsSyncFailed, adminEmailFailed, adminSystemErrors,
  subjectConfirmation, subjectApproved, subjectRejected, subjectPaymentReminder, subjectCampReminder, subjectCompletion
}`;

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return fetchWithFallback<NotificationSettings>(QUERY, DEFAULT);
}
