module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      colors: {
        primary: '#1F134A', // Smart Mama Indigo
        accent: '#E89487'   // Smart Mama Coral
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
