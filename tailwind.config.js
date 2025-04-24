/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      pretendard: ["var(--font-pretendard)"],
      hakgyoAnsim: ["var(--font-hakgyo-ansim)"],
    },
    fontSize: {
      "title-m": [
        "16px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "700",
        },
      ],
      "title-xs": [
        "12px",
        {
          lineHeight: "140%",
          letterSpacing: "-0.3%",
          fontWeight: "700",
        },
      ],
      "title-1": [
        "24px",
        {
          lineHeight: "160%",
          letterSpacing: "0%",
          fontWeight: "400",
        },
      ],
      "title-2": [
        "20px",
        {
          lineHeight: "160%",
          letterSpacing: "0%",
          fontWeight: "400",
        },
      ],
      "title-3": [
        "16px",
        {
          lineHeight: "160%",
          letterSpacing: "0%",
          fontWeight: "400",
        },
      ],
      "subtitle-l": [
        "18px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "600",
        },
      ],
      "subtitle-s": [
        "14px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "600",
        },
      ],
      "body-l": [
        "18px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "400",
        },
      ],
      "body-m": [
        "16px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "400",
        },
      ],
      "body-s": [
        "14px",
        {
          lineHeight: "150%",
          letterSpacing: "-0.3%",
          fontWeight: "400",
        },
      ],
      caption: [
        "12px",
        {
          lineHeight: "140%",
          letterSpacing: "-0.3%",
          fontWeight: "400",
        },
      ],
    },
    extend: {
      colors: {
        // Design System Colors
        primary: {
          normal: "#00AC78",
          strong: "#58FFBF",
          gradient: "#102B24",
        },
        label: {
          strong: "#000000",
          normal: "#2A2832",
          natural: "#5E616E",
          alternative: "#A7A9B4",
          assistive: "#C8C9D0",
        },
        background: {
          natural: "#F4F4F6",
          alternative: "#F9FAFA",
          normal: "#FFFFFF",
        },
        line: {
          normal: "#EEEFF1",
        },
        status: {
          error: "#E82929",
        },
        component: {
          strong: "#D6D7DC",
          dimmer: "rgba(0, 0, 0, 0.7)",
        },
        // Original Shadcn Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
