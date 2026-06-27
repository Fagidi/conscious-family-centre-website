import "server-only";
import { getAllRegistrations } from "./queries";
import { getEmailLogs } from "@/lib/notifications/logger";
import type { Registration } from "./types";
import type { EmailLogEntry } from "@/lib/notifications/logger";

export type ActivityType =
  | "registration"
  | "status-change"
  | "check-in"
  | "completion"
  | "cancellation"
  | "email-sent"
  | "email-failed"
  | "sheets-sync"
  | "sheets-failed"
  | "payment"
  | "system";

export interface ActivityEvent {
  id:        string;
  type:      ActivityType;
  title:     string;
  detail?:   string;
  actor?:    string;
  ref?:      string;
  timestamp: string;
  adminOnly: boolean;
}

// Secretary-visible event titles (operational)
const SECRETARY_ALLOWED_TITLES = new Set([
  "Registration Submitted",
  "Payment Proof Uploaded",
  "Confirmation Email Sent",
  "Admin Notification Sent",
  "Status Updated",
  "Registration Confirmed",
  "Registration Cancelled",
  "Checked In",
  "Marked as Completed",
  "Payment Status Updated",
  "Google Sheets Synced",
]);

function timelineToActivity(reg: Registration): ActivityEvent[] {
  if (!reg.timeline) return [];
  return reg.timeline.map((evt, i) => {
    const isOperational = SECRETARY_ALLOWED_TITLES.has(evt.title) || evt.title.includes("Registration") || evt.title.includes("Email Sent");
    return {
      id:        `${reg._id}-${i}`,
      type:      (evt.title.toLowerCase().includes("email") ? "email-sent"
                : evt.title.toLowerCase().includes("check") ? "check-in"
                : evt.title.toLowerCase().includes("cancel") ? "cancellation"
                : evt.title.toLowerCase().includes("confirm") || evt.title.toLowerCase().includes("status") ? "status-change"
                : evt.title.toLowerCase().includes("sheet") ? "sheets-sync"
                : "registration") as ActivityType,
      title:     evt.title,
      detail:    evt.note,
      actor:     evt.actor,
      ref:       reg.registrationId,
      timestamp: evt.timestamp,
      adminOnly: !isOperational,
    };
  });
}

function logToActivity(log: EmailLogEntry): ActivityEvent {
  const failed = log.status === "failed";
  return {
    id:        `email-${log._id}`,
    type:      failed ? "email-failed" : "email-sent",
    title:     failed ? `Email Failed: ${log.templateKey}` : `Email Sent: ${log.templateKey}`,
    detail:    failed ? log.error : `To: ${log.recipient}`,
    actor:     "System",
    ref:       log.registrationId,
    timestamp: log.sentAt,
    adminOnly: failed, // secretary can see sent emails; only admin sees failures
  };
}

export async function getActivityFeed(role: string): Promise<ActivityEvent[]> {
  const isAdmin = role === "admin";

  const [registrations, emailLogs] = await Promise.all([
    getAllRegistrations(),
    getEmailLogs(100),
  ]);

  const events: ActivityEvent[] = [
    ...registrations.flatMap(timelineToActivity),
    ...emailLogs.map(logToActivity),
  ];

  const filtered = isAdmin ? events : events.filter((e) => !e.adminOnly);

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
