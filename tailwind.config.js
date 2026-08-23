/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F5E6AD',
          400: '#E6CA65',
          500: '#D4AF37',
          600: '#B89025',
          700: '#8C6C16',
        },
        emerald: {
          800: '#064E3B',
          850: '#06382B',
          900: '#04271E',
          950: '#021813',
        },
        dark: {
          800: '#1A1A24',
          900: '#0F0F14',
          950: '#08080C',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'emerald-glow': '0 0 25px rgba(6, 78, 59, 0.35)',
      }
    },
  },
  plugins: [],
}
