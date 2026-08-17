import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        parchment: {
          50: "#fdfbf7",
          100: "#f8f3e9",
          200: "#efe4ce",
          300: "#e4d0ac",
          400: "#d6b883",
          500: "#ca9f60",
          600: "#bd874c",
          700: "#9d6a3d",
          800: "#805536",
          900: "#68462f",
        },
        midnight: {
          950: "#080b14",
          900: "#0c1120",
          800: "#131a31",
          700: "#1d2746",
          600: "#2a365f",
        },
        blood: {
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        forest: {
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        amberGold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        }
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "serif"],
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" },
        },
        floatGently: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        }
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "float-gently": "floatGently 4s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};

export default config;
