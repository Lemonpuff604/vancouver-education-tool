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
      },
      // Line clamp utility for truncating text
      lineClamp: {
        1: '1',
        2: '2',
        3: '3',
      }
    },
  },
  plugins: [
    require("daisyui"),
    // Add line-clamp plugin for text truncation
    require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: [
      "cupcake"      // ← only use the built-in cupcake theme
    ],
    darkTheme: "cupcake"
  },
  // Add custom CSS for better slider visibility
  corePlugins: {
    // Keep all core plugins enabled
  }
};
