import { getAllRegistrations } from "@/lib/admin/queries";
import AdminTopNav from "@/components/admin/AdminTopNav";
import RegistrationsTable from "@/components/admin/RegistrationsTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Registrations" };

export default async function RegistrationsPage() {
  const registrations = await getAllRegistrations();

  return (
    <>
      <AdminTopNav
        title="Registrations"
        subtitle={`${registrations.length} registration${registrations.length !== 1 ? "s" : ""} — Future Makers 2026`}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <RegistrationsTable data={registrations} />
      </main>
    </>
  );
}
