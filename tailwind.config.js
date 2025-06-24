/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'accent-green': '#BFFF71',
        'sena-green': '#4ADE80',
        'sena-green-dark': '#22C55E',
        'accent-teal': '#25dfc4',
        'accent-yellow': '#e4e518',
      },
    },
  },
  plugins: [],
} 