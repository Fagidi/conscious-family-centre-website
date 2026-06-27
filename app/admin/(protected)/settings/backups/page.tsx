import AdminTopNav from "@/components/admin/AdminTopNav";
import BackupExport from "@/components/admin/settings/BackupExport";

export const metadata = { title: "Backups & Export" };

export default function BackupsPage() {
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Backups & Export" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        <BackupExport />
      </main>
    </>
  );
}
