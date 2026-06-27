"use client";

import { useState, useEffect, useTransition } from "react";

interface ServiceStatus {
  name:     string;
  status:   "ok" | "warn" | "error";
  message:  string;
  latency?: number;
}

interface HealthData {
  overall:   "ok" | "warn" | "error";
  services:  ServiceStatus[];
  checkedAt: string;
}

const STATUS_ICON: Record<string, string> = { ok: "●", warn: "◐", error: "○" };
const STATUS_COLOR: Record<string, string> = {
  ok:    "text-green-600",
  warn:  "text-amber-500",
  error: "text-red-600",
};
const BADGE: Record<string, string> = {
  ok:    "bg-green-50 text-green-700 ring-green-200",
  warn:  "bg-amber-50 text-amber-700 ring-amber-200",
  error: "bg-red-50 text-red-700 ring-red-200",
};

export default function SystemHealthClient() {
  const [data, setData]       = useState<HealthData | null>(null);
  const [error, setError]     = useState("");
  const [isPending, start]    = useTransition();

  function refresh() {
    start(async () => {
      setError("");
      try {
        const res  = await fetch("/api/admin/system-health");
        if (!res.ok) { setError(`HTTP ${res.status}`); return; }
        const json = await res.json() as HealthData;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        {data && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${BADGE[data.overall]}`}>
            {STATUS_ICON[data.overall]} Overall: {data.overall.toUpperCase()}
          </span>
        )}
        <button
          onClick={refresh}
          disabled={isPending}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Checking…" : "↺ Refresh"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      {data ? (
        <section className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50">
          {data.services.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{svc.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{svc.message}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                {svc.latency != null && (
                  <span className="text-xs text-gray-400">{svc.latency}ms</span>
                )}
                <span className={`text-lg ${STATUS_COLOR[svc.status]}`}>
                  {STATUS_ICON[svc.status]}
                </span>
              </div>
            </div>
          ))}
        </section>
      ) : !isPending && !error ? null : isPending ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">Checking services…</div>
      ) : null}

      {data && (
        <p className="text-xs text-gray-400 text-right">
          Last checked: {new Date(data.checkedAt).toLocaleString("en-GB")}
        </p>
      )}
    </div>
  );
}
