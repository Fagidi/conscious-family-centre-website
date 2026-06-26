import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: { default: "Admin", template: "%s — CFC Admin" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
