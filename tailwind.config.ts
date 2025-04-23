import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";
import animatePlugin from "tailwindcss-animate";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        web: "1024px",
        tab: "600px",
      },
      colors: {
        // Primary Colors
        primary: {
          normal: "var(--color-primary-normal)",
          strong: "var(--color-primary-strong)",
        },
        // Label Colors
        label: {
          strong: "var(--color-label-strong)",
          normal: "var(--color-label-normal)",
          natural: "var(--color-label-natural)",
          alternative: "var(--color-label-alternative)",
          assistive: "var(--color-label-assistive)",
        },
        // Background Colors
        bg: {
          natural: "var(--color-background-natural)",
          alternative: "var(--color-background-alternative)",
          normal: "var(--color-background-normal)",
        },
        // Line Colors
        line: {
          normal: "var(--color-line-normal)",
        },
        // Status Colors
        status: {
          error: "var(--color-status-error)",
        },
        // Component Colors
        component: {
          strong: "var(--color-component-strong)",
          dimmer: "var(--color-component-dimmer)",
        },
        // System Colors
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        hakgyoAnsim: ["var(--font-hakgyo-ansim)"],
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin],
} satisfies Config;

export default config;
