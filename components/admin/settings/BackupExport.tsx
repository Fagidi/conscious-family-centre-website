"use client";

import { useState, useTransition } from "react";

export default function BackupExport() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");

  function handleExport(format: "json" | "csv") {
    startTransition(async () => {
      setStatus("Preparing export…");
      try {
        const res = await fetch(`/api/admin/export?format=${format}`);
        if (!res.ok) throw new Error(await res.text());
        const blob  = await res.blob();
        const url   = URL.createObjectURL(blob);
        const a     = document.createElement("a");
        a.href      = url;
        a.download  = `cfc-registrations-${new Date().toISOString().slice(0, 10)}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus("Export downloaded!");
      } catch (err) {
        setStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">Export Registrations</h2>
        <p className="mb-4 text-xs text-gray-400">Download all registration data as a JSON or CSV file. Includes all fields and timeline events.</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExport("json")}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            ↓ Export JSON
          </button>
          <button
            onClick={() => handleExport("csv")}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            ↓ Export CSV
          </button>
        </div>
        {status && <p className={`mt-3 text-sm ${status.startsWith("Error") ? "text-red-600" : "text-gray-600"}`}>{status}</p>}
      </section>

      <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5">
        <p className="text-xs text-gray-500">
          For a full Sanity dataset backup, use the <a href="https://www.sanity.io/docs/export" className="underline" target="_blank" rel="noopener noreferrer">Sanity CLI export</a>:
          <code className="block mt-1 font-mono bg-gray-100 rounded px-2 py-1 text-xs">npx sanity dataset export production registrations.tar.gz</code>
        </p>
      </section>
    </div>
  );
}
