export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#1a1a1a',
          light: '#faf9f6', // ivory/cream
          gold: '#c8a951',
          gray: '#888888',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
