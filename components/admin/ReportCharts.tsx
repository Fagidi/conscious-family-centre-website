"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { Registration } from "@/lib/admin/types";

function count<T extends string>(arr: T[]): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, v) => { acc[v] = (acc[v] ?? 0) + 1; return acc; }, {});
}

const GREEN  = "#4E7740";
const AMBER  = "#E8B23A";
const RED    = "#B4452F";
const BLUE   = "#3B82F6";
const PURPLE = "#8B5CF6";
const GRAY   = "#9CA3AF";

const STATUS_COLORS: Record<string, string> = {
  "pending-payment": AMBER, "awaiting-verification": AMBER,
  "confirmed": GREEN, "checked-in": GREEN, "completed": BLUE,
  "cancelled": RED, "waitlist": PURPLE,
};
const PAY_COLORS: Record<string, string> = {
  "awaiting-review": AMBER, "deposit-paid": BLUE, "fully-paid": GREEN,
  "payment-issue": RED, "refunded": GRAY,
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

export default function ReportCharts({ data }: { data: Registration[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray-400">No registrations yet — charts will appear here.</p>
      </div>
    );
  }

  // Registrations by month
  const byMonth = Object.entries(count(data.map((r) => r.selectedMonths ?? "Unknown")))
    .map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));

  // Registrations by weeks
  const byWeeks = Object.entries(count(data.map((r) => r.selectedWeeks ?? "Unknown")))
    .map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));

  // Age distribution
  const byAge = Object.entries(count(data.map((r) => r.childrenAges ?? "Unknown")))
    .map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));

  // Registration status
  const byStatus = Object.entries(count(data.map((r) => r.status))).map(([name, value]) => ({
    name: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value, fill: STATUS_COLORS[name] ?? GRAY,
  }));

  // Payment status
  const byPayment = Object.entries(count(data.map((r) => r.paymentStatus))).map(([name, value]) => ({
    name: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value, fill: PAY_COLORS[name] ?? GRAY,
  }));

  // Registrations over time (by day)
  const byDay = Object.entries(
    count(data.map((r) => r.submissionDate?.slice(0, 10) ?? "Unknown"))
  ).map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name)).slice(-30);

  return (
    <div className="grid gap-5 sm:grid-cols-2">

      <ChartCard title="Registrations by Month">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Registrations" fill={GREEN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Programme Duration">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byWeeks}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Registrations" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Age Group Distribution">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byAge}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Children" fill={AMBER} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Registration Status">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${Math.round((percent ?? 0) * 100)}%`} labelLine={false}>
              {byStatus.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Payment Status">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={byPayment} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${Math.round((percent ?? 0) * 100)}%`} labelLine={false}>
              {byPayment.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Registrations Over Time (last 30 days)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Submissions" fill={PURPLE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
