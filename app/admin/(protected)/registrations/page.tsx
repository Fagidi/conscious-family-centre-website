import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import { getAllRegistrations } from "@/lib/admin/queries";
import AdminTopNav from "@/components/admin/AdminTopNav";
import RegistrationsTable from "@/components/admin/RegistrationsTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Registrations" };

interface AdminPayload extends JWTPayload { role?: string }

async function getRole(): Promise<string> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return "admin";
    const token = (await cookies()).get("admin-session")?.value;
    if (!token) return "admin";
    const { payload } = await jwtVerify<AdminPayload>(token, new TextEncoder().encode(secret));
    return payload.role ?? "admin";
  } catch {
    return "admin";
  }
}

export default async function RegistrationsPage() {
  const [registrations, role] = await Promise.all([getAllRegistrations(), getRole()]);

  return (
    <>
      <AdminTopNav
        title="Registrations"
        subtitle={`${registrations.length} registration${registrations.length !== 1 ? "s" : ""} — Future Makers 2026`}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <RegistrationsTable data={registrations} role={role} />
      </main>
    </>
  );
}
