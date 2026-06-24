/**
 * Framework-agnostic helpers shared across the app. Dependency-free on
 * purpose (no clsx/zod) to keep the mobile bundle light.
 */

/** Join class names, dropping falsy values. Minimal `clsx`. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format a Naira amount: 45000 → "₦45,000". */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date for display: "2026-08-12" → "12 Aug 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Compact range: "12–16 Aug 2026" or across months/years as needed. */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(end);
    return `${start.getDate()}–${end.getDate()} ${month}`;
  }
  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Stable, URL/gateway-safe payment reference, e.g. "cfc-camp-lf83k2-9qud". */
export function generateReference(prefix = "cfc"): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${time}-${rand}`;
}

/** Build a wa.me deep link from a phone number + optional prefilled text. */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
