"use client";

import { useState, useTransition } from "react";
import type { TemplateKey, EmailBranding, NotificationSettings } from "@/lib/notifications/types";
import { renderSample } from "@/lib/notifications/templates";

interface Props {
  branding:  EmailBranding;
  settings:  NotificationSettings;
}

const TEMPLATES: { key: TemplateKey; label: string; audience: "parent" | "admin" }[] = [
  { key: "confirmation",    label: "Registration Confirmation", audience: "parent" },
  { key: "approved",        label: "Registration Approved",     audience: "parent" },
  { key: "rejected",        label: "Registration Rejected",     audience: "parent" },
  { key: "payment-reminder",label: "Payment Reminder",          audience: "parent" },
  { key: "camp-reminder",   label: "Camp Reminder",             audience: "parent" },
  { key: "completion",      label: "Post-Camp Thank You",       audience: "parent" },
  { key: "admin-alert",     label: "Admin Alert",               audience: "admin"  },
];

export default function TemplatesClient({ branding, settings }: Props) {
  const [selected, setSelected] = useState<TemplateKey>("confirmation");
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const previewHtml = renderSample(selected, branding);

  function handleSendTest() {
    if (!testEmail) return;
    startTransition(async () => {
      setTestStatus("Sending…");
      try {
        const res = await fetch("/api/admin/notifications/send-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateKey: selected, to: testEmail }),
        });
        const json = await res.json() as { ok: boolean; status?: string; error?: string };
        if (json.ok) {
          setTestStatus(`Sent (${json.status ?? "ok"})`);
        } else {
          setTestStatus(`Failed: ${json.error ?? "Unknown"}`);
        }
      } catch (err) {
        setTestStatus(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
      }
    });
  }

  return (
    <div className="flex gap-6 h-full min-h-0">
      {/* Left: template list */}
      <div className="w-56 shrink-0 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Templates</p>
        {TEMPLATES.map(({ key, label, audience }) => (
          <button
            key={key}
            onClick={() => { setSelected(key); setTestStatus(""); }}
            className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors ${
              selected === key
                ? "bg-forest-600 text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="block">{label}</span>
            <span className={`text-xs ${selected === key ? "text-forest-200" : "text-gray-400"}`}>{audience}</span>
          </button>
        ))}
      </div>

      {/* Right: preview + actions */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Send test */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-wrap items-center gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 min-w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            onClick={handleSendTest}
            disabled={isPending || !testEmail}
            className="rounded-lg bg-forest-600 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700 disabled:opacity-50 transition-colors"
          >
            Send Test Email
          </button>
          {testStatus && (
            <span className={`text-sm ${testStatus.startsWith("Failed") || testStatus.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
              {testStatus}
            </span>
          )}
        </div>

        {/* Preview iframe */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white" style={{ height: "calc(100vh - 280px)" }}>
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-xs text-gray-400 font-mono">
            Preview: {selected}
          </div>
          <iframe
            srcDoc={previewHtml}
            title="Email preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
