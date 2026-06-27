"use client";

import { useState, useTransition } from "react";
import type { NotificationSettings } from "@/lib/notifications/types";
import { saveNotificationSettings } from "@/lib/admin/settingsActions";

interface Props { settings: NotificationSettings }

interface ToggleGroup {
  title:   string;
  items:   { key: keyof NotificationSettings; label: string }[];
}

const GROUPS: ToggleGroup[] = [
  {
    title: "Parent Notifications",
    items: [
      { key: "confirmationEmail",    label: "Registration confirmation" },
      { key: "approvedEmail",        label: "Registration approved" },
      { key: "rejectedEmail",        label: "Registration rejected" },
      { key: "paymentReminderEmail", label: "Payment reminder" },
      { key: "paymentReceivedEmail", label: "Payment received" },
      { key: "campReminderEmail",    label: "Camp reminder (7d / 3d / 1d before start)" },
      { key: "completionEmail",      label: "Post-camp thank you" },
    ],
  },
  {
    title: "Admin Notifications",
    items: [
      { key: "adminNewRegistration",     label: "New registration submitted" },
      { key: "adminPaymentProof",        label: "Payment proof uploaded" },
      { key: "adminPaymentVerification", label: "Payment requires verification" },
      { key: "adminCancelled",           label: "Registration cancelled" },
      { key: "adminCapacityWarning",     label: "Camp capacity warning (80%+)" },
      { key: "adminCampFull",            label: "Camp is full" },
      { key: "adminSheetsSyncFailed",    label: "Google Sheets sync failed" },
      { key: "adminEmailFailed",         label: "Email delivery failed" },
      { key: "adminSystemErrors",        label: "System errors" },
    ],
  },
];

export default function NotificationToggles({ settings }: Props) {
  const [values, setValues] = useState<NotificationSettings>(settings);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle(key: keyof NotificationSettings) {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
    setError("");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveNotificationSettings(values);
      if (result.ok) setSaved(true);
      else setError(result.error ?? "Save failed");
    });
  }

  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <section key={group.title} className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">{group.title}</h2>
          <div className="space-y-1">
            {group.items.map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer">
                <span className="text-sm text-gray-700">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!values[key]}
                  onClick={() => toggle(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${
                    values[key] ? "bg-forest-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${values[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-forest-600 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
