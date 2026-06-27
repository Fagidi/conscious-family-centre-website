"use client";

import { useState, useTransition } from "react";
import type { EmailBranding } from "@/lib/notifications/types";
import { saveEmailBranding } from "@/lib/admin/settingsActions";

interface Props { branding: EmailBranding }

export default function EmailBrandingForm({ branding }: Props) {
  const [values, setValues] = useState<EmailBranding>(branding);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const [isPending, startTransition] = useTransition();

  function set(key: keyof EmailBranding, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError("");
  }

  const FIELDS: { key: keyof EmailBranding; label: string; type?: string; note?: string }[] = [
    { key: "senderName",       label: "Sender Name" },
    { key: "senderEmail",      label: "Sender Email",       type: "email", note: "Must be verified in Brevo" },
    { key: "replyTo",          label: "Reply-To Email",     type: "email" },
    { key: "schoolAddress",    label: "School Address" },
    { key: "phone",            label: "Phone Number" },
    { key: "website",          label: "Website URL",        type: "url" },
    { key: "facebook",         label: "Facebook URL",       type: "url" },
    { key: "instagram",        label: "Instagram URL",      type: "url" },
    { key: "footerCopyright",  label: "Footer Copyright" },
    { key: "footerDisclaimer", label: "Footer Disclaimer" },
    { key: "accentColor",      label: "Accent Colour (hex)", note: "e.g. #2F5D45" },
  ];

  function handleSave() {
    startTransition(async () => {
      const result = await saveEmailBranding(values);
      if (result.ok) setSaved(true);
      else setError(result.error ?? "Save failed");
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Email Branding</h2>
        {FIELDS.map(({ key, label, type = "text", note }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {key === "footerDisclaimer" ? (
              <textarea
                value={(values[key] as string) ?? ""}
                onChange={(e) => set(key, e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            ) : (
              <input
                type={type}
                value={(values[key] as string) ?? ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            )}
            {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
          </div>
        ))}
      </section>

      {values.accentColor && (
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-lg border border-gray-200 shadow-sm" style={{ background: values.accentColor }} />
          <span className="text-sm text-gray-500">Preview of accent colour</span>
        </div>
      )}

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
