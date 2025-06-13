/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom CSS variables for sliders
      colors: {
        'slider-track': '#e2e8f0',
        'slider-range': '#3b82f6',
        'slider-thumb': '#3b82f6',
      }
    },
  },
  plugins: [
    require("daisyui")
    // Remove the line-clamp plugin since it's built into modern Tailwind
  ],
  daisyui: {
    themes: [
      "cupcake"      // ← only use the built-in cupcake theme
    ],
    darkTheme: "cupcake"
  }
};
