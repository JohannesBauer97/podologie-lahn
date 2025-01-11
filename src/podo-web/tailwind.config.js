/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontWeight: {
        'thin': 100,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 500,  // use 500 instead of 600
        'bold': 700,
        'extrabold': 700, // use 700 instead of 800
        'black': 900
      },
    },
  },
  plugins: [],
}

