import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = { title: "General Settings" };

export default function GeneralSettingsPage() {
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? "—";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "—";
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "—";

  return (
    <>
      <AdminTopNav title="Settings" subtitle="General" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Site Configuration</h2>
          <div className="space-y-3">
            {[
              { label: "Site URL",          value: siteUrl },
              { label: "Sanity Project ID", value: projectId },
              { label: "Sanity Dataset",    value: dataset },
              { label: "API Version",       value: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-mono text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Content Management</h2>
          <p className="mb-4 text-xs text-gray-400">Edit website content, camp settings, and notification branding in Sanity Studio.</p>
          <a
            href="/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ↗ Open Sanity Studio
          </a>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Google Sheets</h2>
          <p className="mb-4 text-xs text-gray-400">Registration data is automatically synced when a parent submits the form.</p>
          {process.env.GOOGLE_SHEETS_URL ? (
            <a
              href={process.env.GOOGLE_SHEETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              ↗ Open Google Sheet
            </a>
          ) : (
            <p className="text-sm text-gray-500">Set <code className="rounded bg-gray-100 px-1 text-xs">GOOGLE_SHEETS_URL</code> in your environment to add a direct link.</p>
          )}
        </section>

      </main>
    </>
  );
}
