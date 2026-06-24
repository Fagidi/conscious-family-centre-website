import type { SVGProps } from "react";

/**
 * Minimal line-icon set (replaces emoji). Keys map to the CFC identity:
 * nature, growth, community, care. Add paths here as needed.
 */
const paths: Record<string, string> = {
  leaf: "M11 3C6 3 3 7 3 12c0 3 1 5 1 5s2-9 11-11c0 0-1 8-8 10 5 1 9-2 10-7 1-5-1-9-6-6z",
  sprout: "M12 22V12m0 0C12 8 9 6 4 6c0 5 3 7 8 6Zm0 0c0-4 3-6 8-6 0 5-3 7-8 6Z",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-14-2.5 5.5L8 16l2.5-5.5L16 8Z",
  sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] ?? paths.leaf} />
    </svg>
  );
}
