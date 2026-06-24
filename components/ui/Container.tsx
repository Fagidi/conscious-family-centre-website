import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  /** "content" = 1200px reading width, "site" = 1440px full. */
  width?: "content" | "site" | "prose";
  as?: ElementType;
  className?: string;
}

/** Centered, gutter-aware content container. */
export default function Container({ children, width = "content", as: Tag = "div", className }: ContainerProps) {
  const max = width === "site" ? "max-w-site" : width === "prose" ? "max-w-prose" : "max-w-content";
  return <Tag className={cn("mx-auto w-full px-gutter", max, className)}>{children}</Tag>;
}
