import AdminTopNav from "@/components/admin/AdminTopNav";
import Link from "next/link";
import { getEmailLogs } from "@/lib/notifications/logger";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const logs = await getEmailLogs(50);

  const total  = logs.length;
  const sent   = logs.filter((l) => l.status === "sent").length;
  const failed = logs.filter((l) => l.status === "failed").length;
  const noop   = logs.filter((l) => l.status === "no-provider" || l.status === "disabled").length;

  const recent = logs.slice(0, 10);

  return (
    <>
      <AdminTopNav title="Notifications" subtitle="Communication overview" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total",      value: total,  color: "text-gray-800" },
            { label: "Sent",       value: sent,   color: "text-green-700" },
            { label: "Failed",     value: failed, color: "text-red-600" },
            { label: "No-op",      value: noop,   color: "text-gray-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/notifications/logs" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View All Logs →
          </Link>
          <Link href="/admin/notifications/templates" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Email Templates →
          </Link>
          <Link href="/admin/settings/notifications" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Notification Settings →
          </Link>
        </div>

        {/* Recent emails */}
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Recent Emails</h2>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No emails logged yet. Submit a registration to trigger the first email.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-medium">Recipient</th>
                  <th className="px-5 py-3 text-left font-medium">Template</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((log) => (
                  <tr key={log._id}>
                    <td className="px-5 py-3 text-gray-700 font-mono text-xs">{log.recipient || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{log.templateKey}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        log.status === "sent"
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : log.status === "failed"
                          ? "bg-red-50 text-red-700 ring-red-200"
                          : "bg-gray-100 text-gray-500 ring-gray-200"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{log.sentAt ? new Date(log.sentAt).toLocaleString("en-GB") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Brevo status */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Provider Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Brevo</p>
              <p className="text-xs text-gray-400">Transactional email provider</p>
            </div>
            {process.env.BREVO_API_KEY ? (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> API key configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> API key not set — emails will no-op
              </span>
            )}
          </div>
        </section>

      </main>
    </>
  );
}
