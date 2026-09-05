/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#05070d',
          800: '#0a0f1d',
          700: '#11182c',
          600: '#1b233d',
          500: '#283457',
          accent: '#00d4ff',
          neon: '#00f2fe',
          glow: '#1464ff'
        }
      }
    },
  },
  plugins: [],
}
