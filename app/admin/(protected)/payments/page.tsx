import { getAllRegistrations } from "@/lib/admin/queries";
import AdminTopNav from "@/components/admin/AdminTopNav";
import RegistrationsTable from "@/components/admin/RegistrationsTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payment Verification" };

export default async function PaymentsPage() {
  const all    = await getAllRegistrations();
  const pending = all.filter((r) => r.paymentStatus === "awaiting-review");
  const issues  = all.filter((r) => r.paymentStatus === "payment-issue");
  const toReview = [...issues, ...pending];

  return (
    <>
      <AdminTopNav
        title="Payment Verification"
        subtitle={`${pending.length} awaiting review · ${issues.length} with issues`}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Awaiting Review", value: pending.length,                                 tone: pending.length  > 0 ? "bg-amber-50 border-amber-200 text-amber-700" : "" },
            { label: "Payment Issues",  value: issues.length,                                  tone: issues.length   > 0 ? "bg-red-50   border-red-200   text-red-700"   : "" },
            { label: "Deposit Paid",    value: all.filter((r) => r.paymentStatus === "deposit-paid").length,   tone: "" },
            { label: "Fully Paid",      value: all.filter((r) => r.paymentStatus === "fully-paid").length,     tone: "bg-green-50 border-green-200 text-green-700" },
          ].map((c) => (
            <div key={c.label} className={`rounded-xl border p-4 ${c.tone || "bg-white border-gray-200"}`}>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{c.label}</p>
              <p className="mt-1.5 text-3xl font-bold">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-800">How to verify a payment</p>
          <ol className="mt-1.5 list-decimal list-inside space-y-1 text-sm text-amber-700">
            <li>Click a registration to open the details panel.</li>
            <li>Click <strong>View / Download Proof</strong> to review the payment receipt.</li>
            <li>If confirmed, change Payment Status to <strong>Deposit Paid</strong> or <strong>Fully Paid</strong> and Registration Status to <strong>Confirmed</strong>.</li>
            <li>If there is an issue, set Payment Status to <strong>Payment Issue</strong> and add a note.</li>
          </ol>
        </div>

        {toReview.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
            <div className="text-center">
              <p className="text-3xl mb-2">✓</p>
              <p className="text-sm font-medium text-gray-600">All payments are verified.</p>
              <p className="text-xs text-gray-400 mt-1">Nothing requires attention right now.</p>
            </div>
          </div>
        ) : (
          <RegistrationsTable data={toReview} />
        )}
      </main>
    </>
  );
}
