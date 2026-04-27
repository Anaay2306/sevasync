import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201c",
        field: "#f5f1e8",
        leaf: "#0f766e",
        saffron: "#f59e0b",
        river: "#2563eb",
        rose: "#e11d48"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 28, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
