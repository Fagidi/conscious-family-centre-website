import { Suspense } from "react";
import Link from "next/link";
import { getAllRegistrations, getRegistrationStats } from "@/lib/admin/queries";
import AdminTopNav from "@/components/admin/AdminTopNav";
import StatsGrid from "@/components/admin/StatsGrid";
import CapacityBar from "@/components/admin/CapacityBar";
import { RegistrationStatusBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import type { RegistrationStatus, PaymentStatus } from "@/lib/admin/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
  catch { return "—"; }
}

const QUICK_ACTIONS = [
  { label: "All Registrations", href: "/admin/registrations", icon: "▤", desc: "View and manage" },
  { label: "Payment Verification", href: "/admin/payments",   icon: "₢", desc: "Review proofs" },
  { label: "Reports",             href: "/admin/reports",     icon: "▦", desc: "View charts" },
  { label: "Settings",            href: "/admin/settings",    icon: "◈", desc: "Configure" },
];

async function DashboardContent() {
  const [stats, registrations] = await Promise.all([
    getRegistrationStats(),
    getAllRegistrations(),
  ]);
  const recent = registrations.slice(0, 8);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <StatsGrid stats={stats} />
      <CapacityBar stats={stats} />

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 hover:border-leaf-600/40 hover:shadow-sm transition-all"
            >
              <span className="text-xl">{a.icon}</span>
              <span className="text-sm font-medium text-gray-900">{a.label}</span>
              <span className="text-xs text-gray-400">{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent registrations */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Recent Registrations</h2>
          <Link href="/admin/registrations" className="text-xs font-medium text-leaf-600 hover:text-leaf-500">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
            <p className="text-sm text-gray-400">No registrations yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Registration ID", "Child", "Parent", "Programme", "Status", "Submitted"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.registrationId ?? "—"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.childrenFullNames ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.parentFullName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.selectedMonths} · {r.selectedWeeks}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <RegistrationStatusBadge status={r.status as RegistrationStatus} />
                        <PaymentStatusBadge      status={r.paymentStatus as PaymentStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.submissionDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <>
      <AdminTopNav
        title="Dashboard"
        subtitle="Future Makers Summer Experience 2026"
      />
      <Suspense fallback={<div className="flex-1 p-6 space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}
      </div>}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
