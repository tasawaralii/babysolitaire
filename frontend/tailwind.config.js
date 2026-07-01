/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {

        chewy: ['"Chewy"', 'system-ui'],
        pacifico: ['"Pacifico"', 'cursive'],
        rye: ['"Rye"', 'serif'],
      }
    },
  },
  plugins: [],
}