/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#00f0ff',
        'brand-secondary': '#7000ff',
        'bg-dark': '#050505',
        'bg-darker': '#020202',
        'text-main': '#f0f0f0',
        'text-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      keyframes: {
        'scroll-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' }
        },
        'spin': {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      },
      animation: {
        'scroll-down': 'scroll-down 1.5s ease-in-out infinite',
        'spin': 'spin 10s linear infinite'
      }
    },
  },
  plugins: [],
}
