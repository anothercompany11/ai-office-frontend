import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        web: "601px",
        xs: "475px", // 모바일 소형 기기 지원
      },
      fontFamily: {
        pretendard: [
          "var(--font-pretendard)",
          "var(--font-noto-sans-kr)",
          "sans-serif",
        ],
        notoSansKr: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        black: "hsl(var(--black))",
        error: "hsl(var(--error))",
      },
      borderRadius: {
        lg: "var(--radius)", // 10px
        md: "calc(var(--radius) - 2px)", // 8px
        sm: "calc(var(--radius) - 4px)", // 6px
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
      },
      spacing: {
        "0.5": "0.125rem", // 2px
        "1": "0.25rem", // 4px
        "1.5": "0.375rem", // 6px
        "2": "0.5rem", // 8px
        "2.5": "0.625rem", // 10px
        "3": "0.75rem", // 12px
        "4": "1rem", // 16px
        "5": "1.25rem", // 20px
        "6": "1.5rem", // 24px
        "8": "2rem", // 32px
        "10": "2.5rem", // 40px
        "12": "3rem", // 48px
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function ({ addUtilities, addComponents }) {
      addUtilities({
        ".heading-1": {
          fontSize: "32px",
          lineHeight: "48px",
          fontWeight: "700",
        },
        ".heading-2": {
          fontSize: "24px",
          lineHeight: "36px",
          fontWeight: "700",
        },
        ".heading-3": {
          fontSize: "20px",
          lineHeight: "30px",
          fontWeight: "700",
        },
        ".heading-3-thin": {
          fontSize: "20px",
          lineHeight: "30px",
          fontWeight: "400",
        },
        ".heading-4": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "700",
        },
        ".heading-5": {
          fontSize: "14px",
          lineHeight: "25.2px",
          fontWeight: "700",
        },
        ".heading-6": {
          fontSize: "12px",
          lineHeight: "21.6px",
          fontWeight: "700",
        },
        ".subtitle-1": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "600",
        },
        ".subtitle-2": {
          fontSize: "14px",
          lineHeight: "25.2px",
          fontWeight: "600",
        },
        ".subtitle-3": {
          fontSize: "12px",
          lineHeight: "21.6px",
          fontWeight: "600",
        },
        ".body-1": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
        },
        ".body-2": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
        },
        ".body-2-bold": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "700",
        },
        ".caption": {
          fontSize: "12px",
          lineHeight: "21.6px",
          fontWeight: "400",
        },
        ".caption-bold": {
          fontSize: "12px",
          lineHeight: "21.6px",
          fontWeight: "700",
        },
        ".button-s-cta": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "800",
        },
        ".button-s": {
          fontSize: "12px",
          lineHeight: "21.6px",
          fontWeight: "700",
        },
        ".button-m-cta": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "800",
        },
        ".button-m": {
          fontSize: "14px",
          lineHeight: "22.4px",
          fontWeight: "700",
        },
        ".hide-scroll-bar": {
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, and Opera
          },
        },
        ".toast-shadow": {
          boxShadow: "0px 12px 20px 0px #C4C4C440",
        },
        ".medium-1": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "500",
        },
        ".medium-2": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "500",
        },
        ".footer-1": {
          fontSize: "16px",
          lineHeight: "28.8px",
          fontWeight: "700",
        },
        ".footer-2": {
          fontSize: "14px",
          lineHeight: "25.2px",
          fontWeight: "700",
        },
        ".text-balance": {
          textWrap: "balance",
        },
        ".text-pretty": {
          textWrap: "pretty",
        },
        ".shadow-custom": {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
        ".transition-all-200": {
          transition: "all 0.2s ease-in-out",
        },
      });

      addComponents({
        ".card-container": {
          backgroundColor: "hsl(var(--card))",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".flex-between": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      });
    }),
  ],
};
export default config;
