import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const COOKIE_NAME = "admin-session";
const SEVEN_DAYS  = 60 * 60 * 24 * 7;

type UserRole = "admin" | "secretary";

interface User { email: string; hash: string; role: UserRole }

function getUsers(): User[] {
  return [
    { email: process.env.ADMIN_EMAIL ?? "",     hash: process.env.ADMIN_PASSWORD_HASH ?? "",     role: "admin"     as const },
    { email: process.env.SECRETARY_EMAIL ?? "",  hash: process.env.SECRETARY_PASSWORD_HASH ?? "",  role: "secretary" as const },
  ].filter(u => u.email && u.hash);
}

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await new SignJWT({ role: user.role, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(jwtSecret());

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
