import AdminTopNav from "@/components/admin/AdminTopNav";
import EmailBrandingForm from "@/components/admin/settings/EmailBrandingForm";
import { getEmailBranding } from "@/lib/notifications/branding";

export const metadata = { title: "Email Branding" };

export default async function BrandingPage() {
  const branding = await getEmailBranding();
  return (
    <>
      <AdminTopNav title="Settings" subtitle="Email Branding" />
      <main className="flex-1 overflow-y-auto p-6 max-w-2xl">
        <EmailBrandingForm branding={branding} />
      </main>
    </>
  );
}
