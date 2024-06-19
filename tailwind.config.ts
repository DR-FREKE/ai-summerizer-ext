import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-gray": "rgba(0, 0, 0, 0.04)",
        "brand-gray02": "rgba(0, 0, 0, 0.48)",
        "brand-gray03": "rgba(0, 0, 0, 0.08)",
        "brand-white": "rgba(255, 255, 255, 0.64)",
        "brand-white02": "rgba(255, 255, 255, 0.80)",
      },
      maxWidth: {
        custom: "min(90%, 350px)",
      },
      maxHeight: {
        custom: "min(90%, 498px)",
      },
      fontFamily: {
        "lora-font": ["Lora", "Verdana", "Arial", "sans-serif"],
        "grotesk-font": "Space Grotesk",
        "inter-font": "Inter",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "lbl-background":
          "url('https://eightify.app/shared/static/lights-banner/lights-banner-mask-desktop-left.png'), url('https://eightify.app/shared/static/lights-banner/lights-banner-mask-desktop-right.png')",
      },
      backgroundPosition: {
        "lbl-background-position": "left 0 top 0, right 0 top 0",
      },
      backgroundSize: {
        "lbl-background-size": "contain, contain",
      },
      backgroundRepeat: {
        "lbl-background-repeat": "no-repeat, no-repeat",
      },
      animation: {
        "moving-blue": "moving-light-blue 12000ms ease-in-out infinite",
        "moving-violet": "moving-light-violet 14400ms ease-in-out infinite",
        "moving-yellow": "moving-light-yellow 9600ms ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "1" },
        },
        "moving-light-blue": {
          "0%": { transform: "translate(20%, -20%)" },
          "50%": { transform: "translate(-20%, -25%)" },
          "100%": { transform: "translate(20%, -20%)" },
        },
        "moving-light-violet": {
          "0%": { transform: "translate(-40%, -30%)" },
          "50%": { transform: "translate(40%, -20%)" },
          "100%": { transform: "translate(-40%, -30%)" },
        },
        "moving-light-yellow": {
          "0%": { transform: "translate(-30%, -20%)" },
          "50%": { transform: "translate(30%, -30%)" },
          "100%": { transform: "translate(-30%, -20%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
