/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imacPurple: {
          light: '#E6E6FA',
          DEFAULT: '#9370DB',
          dark: '#8A2BE2',
          deep: '#9932CC',
        },
      },
    },
  },
  plugins: [],
};