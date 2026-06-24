import Image, { type ImageProps } from "next/image";
import type { ImageAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

type SmartImageProps = {
  image: ImageAsset;
  className?: string;
} & Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL">;

/**
 * next/image wrapper for resolved Sanity images. Uses the LQIP for blur-up
 * when present. Stock/Unsplash imagery is served via next.config remotePatterns
 * (the optimizer-bypass pattern in project memory).
 */
export default function SmartImage({ image, className, fill, sizes, ...rest }: SmartImageProps) {
  if (!image?.src) return null;
  // Only Sanity CDN images go through the Next optimizer; external/placeholder
  // hosts (Unsplash/picsum) are served unoptimized — the optimizer's slow
  // server-side fetch times out on these (project memory).
  const optimized = image.src.includes("cdn.sanity.io");
  return (
    <Image
      src={image.src}
      alt={image.alt ?? ""}
      fill={fill}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      unoptimized={!optimized}
      className={cn(className)}
      {...rest}
    />
  );
}
