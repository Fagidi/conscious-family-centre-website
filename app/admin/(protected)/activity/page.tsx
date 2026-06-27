import AdminTopNav from "@/components/admin/AdminTopNav";
import { getActivityFeed, type ActivityType } from "@/lib/admin/activity";
import { getAdminRole } from "@/lib/admin/getRole";

export const metadata = { title: "Activity" };

const TYPE_ICON: Record<ActivityType, string> = {
  "registration":  "📋",
  "status-change": "🔄",
  "check-in":      "✅",
  "completion":    "🎓",
  "cancellation":  "❌",
  "email-sent":    "📧",
  "email-failed":  "⚠️",
  "sheets-sync":   "📊",
  "sheets-failed": "⚠️",
  "payment":       "💳",
  "system":        "⚙️",
};

const TYPE_COLOR: Record<ActivityType, string> = {
  "registration":  "bg-blue-50 text-blue-700",
  "status-change": "bg-purple-50 text-purple-700",
  "check-in":      "bg-green-50 text-green-700",
  "completion":    "bg-emerald-50 text-emerald-700",
  "cancellation":  "bg-red-50 text-red-700",
  "email-sent":    "bg-sky-50 text-sky-700",
  "email-failed":  "bg-red-50 text-red-700",
  "sheets-sync":   "bg-gray-50 text-gray-600",
  "sheets-failed": "bg-amber-50 text-amber-700",
  "payment":       "bg-yellow-50 text-yellow-700",
  "system":        "bg-gray-100 text-gray-500",
};

export default async function ActivityPage() {
  const role   = await getAdminRole();
  const events = await getActivityFeed(role);

  const subtitle = role === "admin"
    ? `${events.length} events — full feed`
    : `${events.length} events — operational feed`;

  return (
    <>
      <AdminTopNav title="Activity" subtitle={subtitle} />
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl">
        {events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-sm text-gray-400">No activity yet. Activity appears here as registrations are submitted and processed.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {events.map((event, i) => (
                <div key={event.id} className="relative flex gap-4 pb-6">
                  {/* Dot */}
                  <div className={`relative z-10 mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-sm ${TYPE_COLOR[event.type]}`}>
                    {TYPE_ICON[event.type]}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        {event.detail && <p className="text-xs text-gray-500 mt-0.5 truncate">{event.detail}</p>}
                        {event.ref && (
                          <p className="text-xs font-mono text-gray-400 mt-0.5">{event.ref}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">{new Date(event.timestamp).toLocaleString("en-GB")}</p>
                        {event.actor && <p className="text-xs text-gray-300 mt-0.5">{event.actor}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
