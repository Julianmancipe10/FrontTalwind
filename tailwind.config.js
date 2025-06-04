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
        'accent-teal': '#25dfc4',
        'accent-yellow': '#e4e518',
      },
    },
  },
  plugins: [],
} 