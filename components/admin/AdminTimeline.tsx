import type { TimelineEvent } from "@/lib/admin/types";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export default function AdminTimeline({ events }: { events?: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-gray-400 italic">No events recorded yet.</p>;
  }
  const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return (
    <ol className="space-y-3">
      {sorted.map((e, i) => (
        <li key={i} className="flex gap-3">
          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-leaf-600 ring-2 ring-white" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">{e.title}</p>
            <p className="text-xs text-gray-400">{fmtDate(e.timestamp)} · {e.actor}</p>
            {e.note && <p className="mt-0.5 text-xs text-gray-500 italic">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
