import type { Config } from "tailwindcss";

/**
 * SARAI — Design System Tokens
 *
 * Color distribution: black ~70%, white ~25%, amethyst purple ~5% (accent only).
 * Typography: editorial serif display (Cormorant Garamond) + refined sans (Manrope).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: "#0A0A0C",
          soft: "#101014",
          raise: "#16161C",
          line: "#26262E",
        },
        ivory: {
          DEFAULT: "#F5F3EE",
          dim: "#B9B6AE",
          faint: "#807D76",
        },
        amethyst: {
          DEFAULT: "#9061F9",
          bright: "#A78BFA",
          deep: "#6D3FD8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 9vw, 8.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 6.5vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.15" }],
        eyebrow: ["0.7rem", { lineHeight: "1.4", letterSpacing: "0.32em" }],
      },
      maxWidth: {
        site: "90rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
