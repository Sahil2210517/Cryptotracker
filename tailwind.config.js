/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'price-up': 'priceUp 1s ease',
        'price-down': 'priceDown 1s ease',
      },
      keyframes: {
        priceUp: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(52, 211, 153, 0.2)' },
        },
        priceDown: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(248, 113, 113, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};