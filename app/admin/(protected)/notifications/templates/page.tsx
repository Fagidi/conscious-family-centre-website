import AdminTopNav from "@/components/admin/AdminTopNav";
import TemplatesClient from "@/components/admin/notifications/TemplatesClient";
import { getEmailBranding } from "@/lib/notifications/branding";
import { getNotificationSettings } from "@/lib/notifications/settings";

export const metadata = { title: "Email Templates" };

export default async function TemplatesPage() {
  const [branding, settings] = await Promise.all([getEmailBranding(), getNotificationSettings()]);
  return (
    <>
      <AdminTopNav title="Notifications" subtitle="Email Templates" />
      <main className="flex-1 overflow-y-auto p-6">
        <TemplatesClient branding={branding} settings={settings} />
      </main>
    </>
  );
}
