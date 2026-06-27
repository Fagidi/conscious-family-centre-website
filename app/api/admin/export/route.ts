import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getAllRegistrations } from "@/lib/admin/queries";
import type { Registration } from "@/lib/admin/types";

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}

async function checkAuth(): Promise<boolean> {
  try {
    const token = (await cookies()).get("admin-session")?.value;
    if (!token) return false;
    await jwtVerify(token, jwtSecret());
    return true;
  } catch { return false; }
}

function toCSV(registrations: Registration[]): string {
  const COLS: (keyof Registration)[] = [
    "registrationId", "submissionDate", "status", "paymentStatus",
    "parentFullName", "email", "parentPhone",
    "childrenFullNames", "childrenAges", "childOneGender", "childTwoGender",
    "tshirtSizes", "selectedWeeks", "selectedMonths", "paymentOption",
    "estimatedFee", "emergencyContact", "adminNotes",
  ];
  const header = COLS.join(",");
  const rows = registrations.map((r) =>
    COLS.map((k) => {
      const v = r[k];
      if (v == null) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    }).join(","),
  );
  return [header, ...rows].join("\n");
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? "json";
  const registrations = await getAllRegistrations();

  if (format === "csv") {
    return new NextResponse(toCSV(registrations), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cfc-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(registrations, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cfc-registrations-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
