import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

interface AdminPayload extends JWTPayload { role?: string }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login")   return NextResponse.next();

  const token = request.cookies.get("admin-session")?.value;

  let payload: AdminPayload | null = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, jwtSecret());
      payload = p;
    } catch {
      // invalid or expired
    }
  }

  if (!payload) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Secretary cannot access admin-only areas
  const ADMIN_ONLY = ["/admin/settings", "/admin/notifications", "/admin/system-health"];
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p)) && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
