import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// Primary uses leaf-600 (cream-on-leaf-600 ≈ 4.9:1, passes WCAG AA — risk review C1).
const variants: Record<Variant, string> = {
  primary: "bg-leaf-600 text-cream shadow-soft hover:bg-forest-700",
  secondary: "bg-clay-600 text-cream shadow-soft hover:bg-clay-500",
  ghost: "border border-forest-700/30 text-forest-900 hover:border-leaf-600 hover:bg-forest-700/5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps =
  | (BaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | (BaseProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>);

/**
 * House CTA. Renders a Link when `href` is set, otherwise a <button>.
 * Variants map to the design-system intents (BLUEPRINT §6/§7).
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 ease-organic focus-visible:outline-none",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as { href: string } & React.ComponentProps<typeof Link>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
