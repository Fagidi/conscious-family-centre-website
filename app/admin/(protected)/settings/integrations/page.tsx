import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = { title: "Integrations" };

interface IntegrationStatus {
  label:       string;
  key:         string;
  description: string;
}

const INTEGRATIONS: IntegrationStatus[] = [
  { label: "Sanity CMS",             key: "NEXT_PUBLIC_SANITY_PROJECT_ID", description: "Content management and data storage" },
  { label: "Sanity Write Token",     key: "SANITY_WRITE_TOKEN",            description: "Required for saving registrations" },
  { label: "Brevo Email",            key: "BREVO_API_KEY",                 description: "Transactional email provider" },
  { label: "Brevo Sender Email",     key: "BREVO_SENDER_EMAIL",            description: "From address for all emails" },
  { label: "Admin Notification Email",key: "BREVO_ADMIN_NOTIFICATION_EMAIL",description: "Where admin alerts are sent" },
  { label: "Google Sheets Webhook",  key: "GOOGLE_SHEETS_WEBHOOK_URL",    description: "Registration data sync" },
  { label: "JWT Secret",             key: "JWT_SECRET",                    description: "Admin session signing key" },
];

export default function IntegrationsPage() {
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Integrations" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        <section className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50">
          {INTEGRATIONS.map(({ label, key, description }) => {
            const set = Boolean(process.env[key]);
            return (
              <div key={key} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{key}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset shrink-0 ml-4 ${
                  set
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : "bg-amber-50 text-amber-700 ring-amber-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${set ? "bg-green-500" : "bg-amber-400"}`} />
                  {set ? "Configured" : "Not set"}
                </span>
              </div>
            );
          })}
        </section>

        <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5">
          <p className="text-xs text-gray-500">
            Configure environment variables in your <code className="rounded bg-gray-200 px-1">.env.local</code> file (local) or the Vercel dashboard (production).
            Never expose secret keys to the client.
          </p>
        </section>

      </main>
    </>
  );
}
