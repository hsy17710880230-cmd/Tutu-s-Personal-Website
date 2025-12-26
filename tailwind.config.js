/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD1DC',
        secondary: '#FFFDD0',
        accent: '#B0E0E6',
        background: '#FFF9F0',
        text: '#5D4037',
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      boxShadow: {
        'portfolio': '0 5px 15px rgba(0,0,0,0.05)',
        'hero': '0 10px 30px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        '30': '30px',
      },
      animation: {
        'gradientShift': 'gradientShift 15s ease infinite'
      },
      keyframes: {
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
