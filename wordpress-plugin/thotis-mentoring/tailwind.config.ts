import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // Prefix to avoid collision with WordPress theme styles
  prefix: "th-",
  theme: {
    extend: {
      colors: {
        thotis: {
          blue: "#004E89",
          "blue-dark": "#003A66",
          orange: "#FF6B35",
          "orange-dark": "#E55A2B",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
