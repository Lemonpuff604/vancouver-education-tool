/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
  themes: [
    {
      smartmama: {
        "primary": "#3F72AF",          // Indigo-blue
        "secondary": "#DBE2EF",        // Pale lavender
        "accent": "#F9F7F7",           // Creamy white
        "neutral": "#112D4E",          // Navy
        "base-100": "#ffffff",         // Background
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#F87272",
      },
    },
  ],
  darkTheme: "smartmama"  // Optional: use same colors in dark mode
},
}
