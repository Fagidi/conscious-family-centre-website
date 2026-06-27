import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const role = await getRole();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
