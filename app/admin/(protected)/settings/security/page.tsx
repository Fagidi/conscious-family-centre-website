import AdminTopNav from "@/components/admin/AdminTopNav";

export const metadata = { title: "Security Settings" };

export default function SecurityPage() {
  const jwtConfigured = Boolean(process.env.JWT_SECRET);
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Security" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Session Authentication</h2>
          <p className="mb-4 text-xs text-gray-400">Admin sessions are signed with a JWT secret and stored as httpOnly cookies. Sessions expire after 7 days.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">JWT Secret</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${jwtConfigured ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${jwtConfigured ? "bg-green-500" : "bg-red-500"}`} />
                {jwtConfigured ? "Configured" : "Missing — logins will fail"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Session Duration</span>
              <span className="text-sm text-gray-800">7 days</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Cookie Type</span>
              <span className="text-sm text-gray-800">httpOnly · Secure · SameSite=Lax</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Role Access</h2>
          <p className="mb-4 text-xs text-gray-400">Role-based access controls what each account can see and do.</p>
          <div className="space-y-2">
            {[
              { role: "admin",     label: "Administrator", access: "Full access to all areas including settings, notifications, and system health" },
              { role: "secretary", label: "Secretary",      access: "Access to registrations, payments, reports, and activity feed. Cannot access settings, notifications, or system health" },
            ].map(({ role, label, access }) => (
              <div key={role} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${role === "admin" ? "bg-forest-100 text-forest-700" : "bg-blue-50 text-blue-700"}`}>{role}</span>
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                </div>
                <p className="text-xs text-gray-500">{access}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Password Management</h2>
          <p className="mb-4 text-xs text-gray-400">Passwords are hashed with bcrypt (cost factor 12). To change a password, generate a new hash and update the environment variable.</p>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-xs font-mono text-gray-600 space-y-2">
            <p># Generate a new hash (Node.js):</p>
            <p>node -e &quot;const b=require(&apos;bcryptjs&apos;);b.hash(&apos;newpassword&apos;,12).then(console.log)&quot;</p>
            <p className="mt-2"># Then set in Vercel:</p>
            <p>ADMIN_PASSWORD_HASH=&lt;hash&gt;</p>
          </div>
        </section>

      </main>
    </>
  );
}
