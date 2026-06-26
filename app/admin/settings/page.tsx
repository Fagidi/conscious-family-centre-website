import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = { title: "Settings" };

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL ?? "";

export default function SettingsPage() {
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Configuration and integrations" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        {/* Environment status */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Environment Status</h2>
          <div className="space-y-2">
            {[
              { label: "Sanity CMS",        key: "NEXT_PUBLIC_SANITY_PROJECT_ID" },
              { label: "Sanity Write Token", key: "SANITY_WRITE_TOKEN" },
              { label: "Google Sheets",      key: "GOOGLE_SHEETS_WEBHOOK_URL" },
              { label: "Email (Resend)",     key: "RESEND_API_KEY" },
              { label: "Notify From",        key: "NOTIFY_FROM_EMAIL" },
              { label: "Notify To",          key: "CONTACT_NOTIFY_EMAIL" },
            ].map(({ label, key }) => {
              const set = Boolean(process.env[key]);
              return (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${set ? "bg-green-50 text-green-700 ring-green-200" : "bg-gray-100 text-gray-500 ring-gray-200"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${set ? "bg-green-500" : "bg-gray-400"}`} />
                    {set ? "Configured" : "Not set"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Google Sheets */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Google Sheets</h2>
          <p className="mb-4 text-xs text-gray-400">Registration data is automatically synced when a parent submits the form.</p>
          <div className="flex flex-wrap gap-2">
            {GOOGLE_SHEETS_URL ? (
              <a
                href={GOOGLE_SHEETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                ↗ Open Google Sheet
              </a>
            ) : (
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 px-4 py-3">
                <p className="text-sm text-gray-500">
                  Set <code className="rounded bg-gray-100 px-1 text-xs">GOOGLE_SHEETS_URL</code> in your environment to add a direct link.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Authentication */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Authentication</h2>
          <p className="mb-4 text-xs text-gray-400">Cookie-based admin session. Expires after 7 days.</p>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2 text-xs font-mono text-gray-600">
            <p><span className="text-gray-400">ADMIN_PASSWORD</span>=your-password-here</p>
            <p><span className="text-gray-400">ADMIN_SESSION_TOKEN</span>=random-64-char-string</p>
          </div>
          <p className="mt-3 text-xs text-gray-400">Set these in your <code className="rounded bg-gray-100 px-1">.env.local</code> file and Vercel environment variables.</p>
        </section>

        {/* Sanity */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Content Management</h2>
          <p className="mb-4 text-xs text-gray-400">Edit website content and manage camp settings in Sanity Studio.</p>
          <a
            href="/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ↗ Open Sanity Studio
          </a>
        </section>

      </main>
    </>
  );
}
