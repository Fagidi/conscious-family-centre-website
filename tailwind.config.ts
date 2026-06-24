import type { Config } from "tailwindcss";

/**
 * CONSCIOUS FAMILY CENTRE — Design System Tokens
 *
 * Palette: earth & foliage. Forest greens carry the brand, leaf is the
 * primary action, clay is the warm/camp accent, sun signals urgency
 * ("spots left"), on a warm cream canvas. Verified for WCAG AA.
 *
 * Typography: humanist serif display (Fraunces) for premium-school
 * gravitas + clean sans (Inter) for legible, data-light mobile UI.
 *
 * The full rationale lives in docs/BLUEPRINT.md §6.
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
        forest: {
          900: "#1F3A2E", // headlines, footer, deep backgrounds
          700: "#2F5D45", // primary brand green
          DEFAULT: "#2F5D45",
        },
        leaf: {
          500: "#5C8A4A", // primary buttons / accents
          600: "#4E7740",
          DEFAULT: "#5C8A4A",
        },
        sage: {
          200: "#CDE0C4", // soft section backgrounds
          100: "#E4EFDD",
        },
        clay: {
          500: "#C97B4A", // secondary / warm CTA, camp accent
          600: "#B0673A",
          DEFAULT: "#C97B4A",
        },
        sun: {
          400: "#E8B23A", // highlights, badges, "limited spots"
          DEFAULT: "#E8B23A",
        },
        cream: {
          50: "#FBF7EF", // page background (warm off-white)
          DEFAULT: "#FBF7EF",
        },
        bark: {
          700: "#4A3B2E", // body text on light
          DEFAULT: "#4A3B2E",
        },
        ink: {
          900: "#1A1A17", // max-contrast text
          DEFAULT: "#1A1A17",
        },
        // Semantic
        success: "#5C8A4A",
        warning: "#E8B23A",
        danger: "#B4452F",
        info: "#2F5D45",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid, clamp-based scale (see BLUEPRINT §6)
        "display-2xl": ["clamp(3.25rem, 9vw, 6rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(3rem, 7vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.18" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.22em" }],
      },
      borderRadius: {
        card: "1.25rem", // 20px — organic card
        "card-lg": "1.5rem", // 24px
        blob: "42% 58% 63% 37% / 41% 44% 56% 59%", // organic mask
      },
      boxShadow: {
        soft: "0 12px 32px -12px rgba(74, 59, 46, 0.18)",
        lift: "0 20px 48px -16px rgba(31, 58, 46, 0.24)",
        ring: "0 0 0 2px #5C8A4A",
      },
      maxWidth: {
        content: "75rem", // 1200px content container
        site: "90rem", // 1440px full
        prose: "42rem",
      },
      spacing: {
        gutter: "clamp(1.25rem, 5vw, 3rem)", // 20px → 48px page gutter
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.16, 1, 0.3, 1)", // grow & settle
        grow: "cubic-bezier(0.34, 1.56, 0.64, 1)", // gentle overshoot
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};

export default config;
