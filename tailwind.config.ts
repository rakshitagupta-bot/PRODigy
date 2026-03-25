import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E1A",
        surface: "#151A2E",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #4A6CF7, #6B5BFF, #8B5CF6)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(74,108,247,0.4), 0 0 48px rgba(107,91,255,0.2)",
        "glow-sm": "0 0 12px rgba(74,108,247,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
