import { NextResponse } from "next/server";

export function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
