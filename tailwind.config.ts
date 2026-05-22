import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#F8F6EF",
        "navy-2": "#FFFFFF",
        gold: "#C9A45C",
        "gold-light": "#E6C77A",
        ivory: "#2B2B2B",
        muted: "#6B7280"
      },
      fontFamily: {
        sans: ["Thmanyah", "Tahoma", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 14px 32px rgba(201, 164, 92, 0.18)",
        "soft-card": "0 18px 55px rgba(43, 43, 43, 0.08)"
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent, rgba(201,164,92,0.72), transparent)"
      }
    }
  },
  plugins: []
};

export default config;
