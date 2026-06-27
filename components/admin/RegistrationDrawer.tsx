"use client";

import { useState, useTransition } from "react";
import type { Registration, RegistrationStatus, PaymentStatus } from "@/lib/admin/types";
import { updateRegistrationStatus, updatePaymentStatus, saveAdminNotes, deleteRegistration } from "@/lib/admin/actions";
import { RegistrationStatusBadge, PaymentStatusBadge } from "./StatusBadge";
import AdminTimeline from "./AdminTimeline";

const REG_STATUSES: { value: RegistrationStatus; label: string }[] = [
  { value: "pending-payment",       label: "Pending Payment" },
  { value: "awaiting-verification", label: "Awaiting Verification" },
  { value: "confirmed",             label: "Confirmed" },
  { value: "checked-in",            label: "Checked In" },
  { value: "completed",             label: "Completed" },
  { value: "cancelled",             label: "Cancelled" },
  { value: "waitlist",              label: "Waitlist" },
];

const PAY_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "awaiting-review", label: "Awaiting Review" },
  { value: "deposit-paid",    label: "Deposit Paid" },
  { value: "fully-paid",      label: "Fully Paid" },
  { value: "payment-issue",   label: "Payment Issue" },
  { value: "refunded",        label: "Refunded" },
];

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}

function fmtFee(n?: number) {
  if (!n) return null;
  return `₦${n.toLocaleString()}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-xs text-gray-900 text-right font-medium">{value}</span>
    </div>
  );
}

interface DrawerProps {
  registration: Registration | null;
  onClose: () => void;
  onDeleted?: () => void;
  role?: string;
}

export default function RegistrationDrawer({ registration: reg, onClose, onDeleted, role }: DrawerProps) {
  const [notes,       setNotes]      = useState(reg?.adminNotes ?? "");
  const [toast,       setToast]      = useState("");
  const [confirmDelete, setConfirm]  = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!reg) return null;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleStatusChange(status: RegistrationStatus) {
    startTransition(async () => {
      const res = await updateRegistrationStatus(reg!._id, status);
      showToast(res.ok ? "Status updated." : `Error: ${res.error}`);
    });
  }

  function handlePaymentChange(paymentStatus: PaymentStatus) {
    startTransition(async () => {
      const res = await updatePaymentStatus(reg!._id, paymentStatus);
      showToast(res.ok ? "Payment status updated." : `Error: ${res.error}`);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteRegistration(reg!._id);
      if (res.ok) {
        onDeleted?.();
      } else {
        showToast(`Error: ${res.error}`);
        setConfirm(false);
      }
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      const res = await saveAdminNotes(reg!._id, notes);
      showToast(res.ok ? "Notes saved." : `Error: ${res.error}`);
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-40 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-mono text-gray-400">{reg.registrationId}</p>
            <p className="mt-0.5 text-base font-semibold text-gray-900">{reg.parentFullName}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RegistrationStatusBadge status={reg.status} />
              <PaymentStatusBadge      status={reg.paymentStatus} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Parent */}
          <Section title="Parent / Guardian">
            <div className="rounded-lg bg-gray-50 px-3 py-0.5">
              <Row label="Name"     value={reg.parentFullName} />
              <Row label="Email"    value={reg.email} />
              <Row label="Phone"    value={reg.parentPhone} />
              <Row label="CFC History" value={reg.cfcAttendanceHistory} />
            </div>
          </Section>

          {/* Children */}
          <Section title="Children">
            <div className="rounded-lg bg-gray-50 px-3 py-0.5">
              <Row label="Name(s)"     value={reg.childrenFullNames} />
              <Row label="Age Group"   value={reg.childrenAges} />
              <Row label="Child 1"     value={reg.childOneGender} />
              <Row label="Child 2"     value={reg.childTwoGender} />
              <Row label="T-shirt(s)"  value={reg.tshirtSizes} />
            </div>
          </Section>

          {/* Nanny */}
          {(reg.nannyName || reg.nannyPhone) && (
            <Section title="Nanny">
              <div className="rounded-lg bg-gray-50 px-3 py-0.5">
                <Row label="Name"  value={reg.nannyName} />
                <Row label="Phone" value={reg.nannyPhone} />
              </div>
            </Section>
          )}

          {/* Emergency */}
          {reg.emergencyContact && (
            <Section title="Emergency Contact">
              <p className="text-sm text-gray-800">{reg.emergencyContact}</p>
            </Section>
          )}

          {/* Programme */}
          <Section title="Programme">
            <div className="rounded-lg bg-gray-50 px-3 py-0.5">
              <Row label="Month(s)"       value={reg.selectedMonths} />
              <Row label="Duration"       value={reg.selectedWeeks} />
              <Row label="Payment Option" value={reg.paymentOption} />
              <Row label="Estimated Fee"  value={fmtFee(reg.estimatedFee)} />
              <Row label="Submitted"      value={fmtDate(reg.submissionDate)} />
            </div>
          </Section>

          {/* Proof of payment */}
          {reg.paymentProofUrl && (
            <Section title="Proof of Payment">
              <a
                href={reg.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>↗</span> View / Download Proof
              </a>
            </Section>
          )}

          {/* Update status */}
          <Section title="Update Status">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Registration Status</label>
                <select
                  defaultValue={reg.status}
                  onChange={(e) => handleStatusChange(e.target.value as RegistrationStatus)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-leaf-600"
                >
                  {REG_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Payment Status</label>
                <select
                  defaultValue={reg.paymentStatus}
                  onChange={(e) => handlePaymentChange(e.target.value as PaymentStatus)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-leaf-600"
                >
                  {PAY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange("confirmed")}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusChange("checked-in")}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-leaf-600 px-3 py-2 text-xs font-semibold text-white hover:bg-leaf-500 disabled:opacity-50 transition-colors"
                >
                  Check In
                </button>
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Section>

          {/* Admin notes */}
          <Section title="Staff Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add private notes visible only to staff…"
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-600"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : "Save Notes"}
            </button>
          </Section>

          {/* Sheets sync */}
          <Section title="Google Sheets">
            <p className="text-sm text-gray-600">
              {reg.googleSheetsSynced === true
                ? `Synced ${reg.googleSheetsSyncedAt ? fmtDate(reg.googleSheetsSyncedAt) : ""}`
                : reg.googleSheetsError
                ? `Sync failed: ${reg.googleSheetsError}`
                : "Not yet synced"}
            </p>
          </Section>

          {/* Timeline */}
          <Section title="Activity Timeline">
            <AdminTimeline events={reg.timeline} />
          </Section>
        </div>

        {/* Delete footer — admin only, always visible */}
        {role === "admin" && (
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirm(true)}
                className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Registration
              </button>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
                <p className="text-sm font-medium text-red-700">Permanently delete this registration. Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirm(false)}
                    disabled={isPending}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isPending ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        )}
      </aside>
    </>
  );
}
