import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

interface AdminPayload extends JWTPayload { role?: string }

export async function getAdminRole(): Promise<string> {
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
