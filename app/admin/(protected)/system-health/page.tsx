import AdminTopNav from "@/components/admin/AdminTopNav";
import SystemHealthClient from "@/components/admin/SystemHealthClient";

export const metadata = { title: "System Health" };

export default function SystemHealthPage() {
  return (
    <>
      <AdminTopNav title="System Health" subtitle="Service status and connectivity" />
      <main className="flex-1 overflow-y-auto p-6">
        <SystemHealthClient />
      </main>
    </>
  );
}
