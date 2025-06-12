/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        smartmama: {
          "primary": "#E89487",
          "secondary": "#1F134A",
          "accent": "#F5F5F5",
          "neutral": "#1D1D1D",
          "base-100": "#ffffff",
          "info": "#93c5fd",
          "success": "#4ade80",
          "warning": "#facc15",
          "error": "#f87171",
        },
      },
    ],
  },
};
