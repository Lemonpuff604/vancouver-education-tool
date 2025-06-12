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
          "primary": "#3F72AF",
          "secondary": "#DBE2EF",
          "accent": "#F9F7F7",
          "neutral": "#112D4E",
          "base-100": "#ffffff",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
    darkTheme: "smartmama", // optional: uses the same palette in dark mode
  },
}
