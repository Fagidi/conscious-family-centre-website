import NextImage, { type ImageProps } from "next/image";

/**
 * next/image with one adjustment: Unsplash placeholder imagery is served
 * directly from Unsplash's CDN (already resized + auto-formatted via URL
 * params), bypassing the Next optimizer — whose server-side refetch of
 * large remote sources can time out. Sanity CDN images and any local
 * assets keep full Next.js optimization.
 */
export default function CineImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = props.unoptimized ?? src.includes("images.unsplash.com");
  return <NextImage {...props} unoptimized={unoptimized} />;
}
