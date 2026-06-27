import AdminTopNav from "@/components/admin/AdminTopNav";
import { getEmailLogs } from "@/lib/notifications/logger";

export const metadata = { title: "Email Logs" };

const STATUS_STYLES: Record<string, string> = {
  sent:        "bg-green-50 text-green-700 ring-green-200",
  failed:      "bg-red-50 text-red-700 ring-red-200",
  "no-provider": "bg-gray-100 text-gray-500 ring-gray-200",
  disabled:    "bg-gray-100 text-gray-400 ring-gray-200",
};

export default async function EmailLogsPage() {
  const logs = await getEmailLogs(200);

  return (
    <>
      <AdminTopNav title="Notifications" subtitle={`Email Logs — ${logs.length} entries`} />
      <main className="flex-1 overflow-y-auto p-6">
        {logs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-sm text-gray-400">No email logs yet. Emails are logged automatically when registrations are submitted.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium">Recipient</th>
                  <th className="px-4 py-3 text-left font-medium">Template</th>
                  <th className="px-4 py-3 text-left font-medium">Registration</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Provider</th>
                  <th className="px-4 py-3 text-left font-medium">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{log.recipient || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{log.templateKey}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.registrationId ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[log.status] ?? "bg-gray-100 text-gray-500 ring-gray-200"}`}>
                        {log.status}
                      </span>
                      {log.error && <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={log.error}>{log.error}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{log.provider || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{log.sentAt ? new Date(log.sentAt).toLocaleString("en-GB") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
