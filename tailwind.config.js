/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD1DC",
        secondary: "#FFFDD0",
        accent: "#B0E0E6",
        background: "#FFF9F0",
        text: "#5D4037",
      },

      fontFamily: {
        sans: ["var(--font-schoolbell)", "system-ui", "sans-serif"],
        title: ["var(--font-fredoka)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },


      boxShadow: {
        portfolio: "0 5px 15px rgba(0,0,0,0.05)",
        hero: "0 10px 30px rgba(0,0,0,0.1)",
      },

      borderRadius: {
        30: "30px",
      },

      animation: {
        gradientShift: "gradientShift 15s ease infinite",
      },

      keyframes: {
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
