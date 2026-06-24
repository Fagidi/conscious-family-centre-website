"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

interface ContactCardProps {
  icon: string;
  label: string;
  /** Display lines (e.g. address spread over rows). */
  lines: string[];
  /** Optional link (tel:, mailto:, https map) wrapping the primary value. */
  href?: string;
  /** Value to copy; when set, a copy button appears. */
  copyValue?: string;
}

/** Premium contact detail card with click-to-action + copy. */
export default function ContactCard({ icon, label, lines, href, copyValue }: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const value = (
    <div className="mt-1 space-y-0.5">
      {lines.map((line, i) => (
        <p key={i} className="leading-snug text-bark-700/85">
          {line}
        </p>
      ))}
    </div>
  );

  return (
    <div className="group flex h-full flex-col rounded-card-lg border border-forest-700/10 bg-white p-6 shadow-soft transition-shadow duration-500 ease-organic hover:shadow-lift">
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-leaf-600 transition-colors duration-500 group-hover:bg-leaf-600 group-hover:text-cream">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-bark-700/55">{label}</h3>
      {href ? (
        <a
          href={href}
          className="rounded outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2"
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {value}
        </a>
      ) : (
        value
      )}
      {copyValue && (
        <button
          type="button"
          onClick={copy}
          className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-medium text-leaf-600 hover:text-forest-700 focus-visible:outline-none focus-visible:underline"
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}
