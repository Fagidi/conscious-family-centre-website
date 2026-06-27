import AdminTopNav from "@/components/admin/AdminTopNav";
import NotificationToggles from "@/components/admin/settings/NotificationToggles";
import { getNotificationSettings } from "@/lib/notifications/settings";

export const metadata = { title: "Notification Settings" };

export default async function NotificationSettingsPage() {
  const settings = await getNotificationSettings();
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Notifications" />
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl">
        <NotificationToggles settings={settings} />
      </main>
    </>
  );
}
