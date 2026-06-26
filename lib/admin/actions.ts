"use server";

import { writeClient } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";
import type { RegistrationStatus, PaymentStatus } from "./types";

function evt(title: string, actor: string, note?: string) {
  return {
    _key: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    _type: "timelineEvent",
    title,
    timestamp: new Date().toISOString(),
    actor,
    ...(note ? { note } : {}),
  };
}

export async function updateRegistrationStatus(
  docId: string,
  status: RegistrationStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!writeClient) return { ok: false, error: "Write client not configured." };
  const labels: Record<RegistrationStatus, string> = {
    "pending-payment":       "Marked as Pending Payment",
    "awaiting-verification": "Moved to Awaiting Verification",
    "confirmed":             "Registration Confirmed",
    "checked-in":            "Checked In",
    "completed":             "Marked as Completed",
    "cancelled":             "Registration Cancelled",
    "waitlist":              "Added to Waitlist",
  };
  try {
    await writeClient
      .patch(docId)
      .set({ status })
      .setIfMissing({ timeline: [] })
      .append("timeline", [evt(labels[status] ?? `Status → ${status}`, "Admin")])
      .commit();
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function updatePaymentStatus(
  docId: string,
  paymentStatus: PaymentStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (!writeClient) return { ok: false, error: "Write client not configured." };
  const labels: Record<PaymentStatus, string> = {
    "awaiting-review": "Payment status: Awaiting Review",
    "deposit-paid":    "Deposit Payment Confirmed",
    "fully-paid":      "Full Payment Verified",
    "payment-issue":   "Payment Issue Flagged",
    "refunded":        "Payment Refunded",
  };
  try {
    await writeClient
      .patch(docId)
      .set({ paymentStatus })
      .setIfMissing({ timeline: [] })
      .append("timeline", [evt(labels[paymentStatus] ?? `Payment → ${paymentStatus}`, "Admin")])
      .commit();
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function saveAdminNotes(
  docId: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!writeClient) return { ok: false, error: "Write client not configured." };
  try {
    await writeClient
      .patch(docId)
      .set({ adminNotes: notes })
      .setIfMissing({ timeline: [] })
      .append("timeline", [evt("Staff notes updated", "Admin")])
      .commit();
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
