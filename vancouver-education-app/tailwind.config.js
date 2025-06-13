/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // (any of your existing customizations here)
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      "cupcake"      // ← only use the built-in cupcake theme
    ],
    darkTheme: "cupcake"
  },
};
