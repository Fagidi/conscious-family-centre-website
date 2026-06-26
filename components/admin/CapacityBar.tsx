import type { RegistrationStats } from "@/lib/admin/types";

export default function CapacityBar({ stats }: { stats: RegistrationStats }) {
  const filled    = stats.confirmed + stats.checkedIn + stats.completed;
  const capacity  = stats.capacity;
  const pct       = capacity > 0 ? Math.min(Math.round((filled / capacity) * 100), 100) : 0;
  const remaining = Math.max(capacity - filled, 0);

  const barColor  = pct >= 100 ? "bg-red-500"    : pct >= 90 ? "bg-red-400"   : pct >= 80 ? "bg-amber-400" : "bg-leaf-600";
  const labelTone = pct >= 90  ? "text-red-600"  : pct >= 80 ? "text-amber-600" : "text-leaf-600";
  const bg        = pct >= 90  ? "bg-red-50 border-red-200" : pct >= 80 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200";

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Camp Capacity</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">
            {filled} <span className="text-base font-normal text-gray-400">/ {capacity} children</span>
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${labelTone}`}>{pct}%</p>
          <p className="text-xs text-gray-400">{remaining} place{remaining !== 1 ? "s" : ""} left</p>
        </div>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 80 && (
        <p className={`mt-2 text-xs font-medium ${labelTone}`}>
          {pct >= 100 ? "Camp is full." : pct >= 90 ? "Nearly full — less than 10% remaining." : "Getting full — over 80% capacity."}
        </p>
      )}
    </div>
  );
}
