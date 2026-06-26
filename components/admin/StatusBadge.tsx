import type { RegistrationStatus, PaymentStatus } from "@/lib/admin/types";

const REG_STYLES: Record<RegistrationStatus, string> = {
  "pending-payment":       "bg-yellow-50  text-yellow-700  ring-yellow-200",
  "awaiting-verification": "bg-amber-50   text-amber-700   ring-amber-200",
  "confirmed":             "bg-green-50   text-green-700   ring-green-200",
  "checked-in":            "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "completed":             "bg-sky-50     text-sky-700     ring-sky-200",
  "cancelled":             "bg-red-50     text-red-700     ring-red-200",
  "waitlist":              "bg-purple-50  text-purple-700  ring-purple-200",
};

const REG_LABEL: Record<RegistrationStatus, string> = {
  "pending-payment":       "Pending Payment",
  "awaiting-verification": "Awaiting Verification",
  "confirmed":             "Confirmed",
  "checked-in":            "Checked In",
  "completed":             "Completed",
  "cancelled":             "Cancelled",
  "waitlist":              "Waitlist",
};

const PAY_STYLES: Record<PaymentStatus, string> = {
  "awaiting-review": "bg-amber-50  text-amber-700  ring-amber-200",
  "deposit-paid":    "bg-sky-50    text-sky-700    ring-sky-200",
  "fully-paid":      "bg-green-50  text-green-700  ring-green-200",
  "payment-issue":   "bg-red-50    text-red-700    ring-red-200",
  "refunded":        "bg-gray-100  text-gray-600   ring-gray-200",
};

const PAY_LABEL: Record<PaymentStatus, string> = {
  "awaiting-review": "Awaiting Review",
  "deposit-paid":    "Deposit Paid",
  "fully-paid":      "Fully Paid",
  "payment-issue":   "Payment Issue",
  "refunded":        "Refunded",
};

export function RegistrationStatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${REG_STYLES[status] ?? "bg-gray-50 text-gray-700 ring-gray-200"}`}>
      {REG_LABEL[status] ?? status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PAY_STYLES[status] ?? "bg-gray-50 text-gray-700 ring-gray-200"}`}>
      {PAY_LABEL[status] ?? status}
    </span>
  );
}
