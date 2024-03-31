import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: "Inter, sans-serif",
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#F3F4F6",
        textBlack: "#111827",
        text: "#6B7280",
        border: "#E5E7EB",
        btnHover: "#337cf5",
        btnActive: "#1d70f8",
      },
    },
  },
  plugins: [],
};
export default config;
