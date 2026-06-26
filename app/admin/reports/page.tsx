import { getAllRegistrations, getRegistrationStats } from "@/lib/admin/queries";
import AdminTopNav from "@/components/admin/AdminTopNav";
import ReportCharts from "@/components/admin/ReportCharts";
import StatsGrid from "@/components/admin/StatsGrid";
import CapacityBar from "@/components/admin/CapacityBar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const [registrations, stats] = await Promise.all([
    getAllRegistrations(),
    getRegistrationStats(),
  ]);

  return (
    <>
      <AdminTopNav
        title="Reports"
        subtitle="Future Makers Summer Experience 2026"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <StatsGrid stats={stats} />
        <CapacityBar stats={stats} />
        <div>
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Analytics</h2>
          <ReportCharts data={registrations} />
        </div>
      </main>
    </>
  );
}
