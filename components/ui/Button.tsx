import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * House CTA. Primary carries the amethyst accent; ghost is a hairline
 * outline that fills on hover. Both use the luxe easing curve.
 */
export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] transition-colors duration-500 ease-luxe";

  const styles =
    variant === "primary"
      ? "bg-amethyst text-white hover:bg-amethyst-deep"
      : "border border-ivory/25 text-ivory hover:border-amethyst hover:text-amethyst-bright";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-block transition-transform duration-500 ease-luxe group-hover:translate-x-1.5"
      >
        →
      </span>
    </Link>
  );
}
