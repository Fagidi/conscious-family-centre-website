import type { RegistrationStats } from "@/lib/admin/types";

interface Card {
  label: string;
  value: number;
  tone?: "default" | "amber" | "green" | "red" | "blue";
  description?: string;
}

function tone(t: Card["tone"]) {
  switch (t) {
    case "amber": return "border-amber-200 bg-amber-50";
    case "green": return "border-green-200 bg-green-50";
    case "red":   return "border-red-200   bg-red-50";
    case "blue":  return "border-sky-200   bg-sky-50";
    default:      return "border-gray-200  bg-white";
  }
}

function valueTone(t: Card["tone"]) {
  switch (t) {
    case "amber": return "text-amber-700";
    case "green": return "text-green-700";
    case "red":   return "text-red-700";
    case "blue":  return "text-sky-700";
    default:      return "text-gray-900";
  }
}

function StatCard({ label, value, tone: t, description }: Card) {
  return (
    <div className={`rounded-xl border p-5 ${tone(t)}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueTone(t)}`}>{value}</p>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: RegistrationStats }) {
  const cards: Card[] = [
    { label: "Total Registrations",    value: stats.total,                                       tone: "default" },
    { label: "Awaiting Verification",  value: stats.awaitingVerification,                        tone: stats.awaitingVerification  > 0 ? "amber" : "default" },
    { label: "Payment Review",         value: stats.awaitingPaymentReview,                       tone: stats.awaitingPaymentReview > 0 ? "amber" : "default" },
    { label: "Confirmed",              value: stats.confirmed,                                   tone: stats.confirmed             > 0 ? "green" : "default" },
    { label: "Checked In",             value: stats.checkedIn,                                   tone: stats.checkedIn             > 0 ? "green" : "default" },
    { label: "Completed",              value: stats.completed,                                   tone: stats.completed             > 0 ? "blue"  : "default" },
    { label: "Cancelled",              value: stats.cancelled,                                   tone: stats.cancelled             > 0 ? "red"   : "default" },
    { label: "Pending Payment",        value: stats.pendingPayment,                              tone: stats.pendingPayment        > 0 ? "amber" : "default" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => <StatCard key={c.label} {...c} />)}
    </div>
  );
}
