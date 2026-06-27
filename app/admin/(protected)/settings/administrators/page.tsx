import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = { title: "Administrators" };

export default function AdministratorsPage() {
  const adminEmail     = process.env.ADMIN_EMAIL ?? "";
  const secretaryEmail = process.env.SECRETARY_EMAIL ?? "";

  const accounts = [
    { role: "admin",     label: "Administrator", email: adminEmail,     hashKey: "ADMIN_PASSWORD_HASH" },
    { role: "secretary", label: "Secretary",      email: secretaryEmail, hashKey: "SECRETARY_PASSWORD_HASH" },
  ].filter((a) => a.email);

  return (
    <>
      <AdminTopNav title="Settings" subtitle="Administrators" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        <section className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50">
          {accounts.length === 0 && (
            <p className="p-5 text-sm text-gray-400">No admin accounts found. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in your environment.</p>
          )}
          {accounts.map(({ role, label, email, hashKey }) => (
            <div key={role} className="flex items-start justify-between px-5 py-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${role === "admin" ? "bg-forest-100 text-forest-700" : "bg-blue-50 text-blue-700"}`}>{role}</span>
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                </div>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">
                <p>Hash key: <code className="font-mono">{hashKey}</code></p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Changing a Password</h3>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-500">
            <li>Generate a new bcrypt hash (see Security tab)</li>
            <li>Update the corresponding <code className="font-mono bg-gray-100 px-1 rounded">_PASSWORD_HASH</code> env var in Vercel</li>
            <li>Redeploy (or wait for next serverless cold start)</li>
          </ol>
        </section>

        <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Adding a New Account</h3>
          <p className="text-xs text-gray-500">Currently, account credentials are stored as environment variables. To add a new role, update <code className="font-mono bg-gray-100 px-1 rounded">app/api/admin/login/route.ts</code> and add the corresponding env vars.</p>
        </section>

      </main>
    </>
  );
}
