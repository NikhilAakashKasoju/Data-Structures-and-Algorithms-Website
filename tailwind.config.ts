import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Channel triplets (`13 7 20`) rather than hex, so Tailwind's
        // <alpha-value> placeholder can compile bg-bg/70 into
        // rgb(var(--c-bg) / 0.7). A hex in the variable breaks every /xx.
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        purple: "rgb(var(--c-primary) / <alpha-value>)",
        "purple-2": "rgb(var(--c-primary-2) / <alpha-value>)",
        magenta: "rgb(var(--c-accent) / <alpha-value>)",
        teal: "rgb(var(--c-teal) / <alpha-value>)",
        lime: "rgb(var(--c-lime) / <alpha-value>)",
        ring: "rgb(var(--c-ring) / <alpha-value>)",
        // Complete rgba values: their alpha differs per theme
        // (white @2% on dark, white @72% on light) and cannot be expressed
        // as one triplet plus a fixed modifier.
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        chip: "var(--chip)",
        faint: "var(--faint)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fieldFlow: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-240" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        floaty: "floaty 5s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
        field: "fieldFlow 7s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
