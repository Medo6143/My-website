/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'bg-dark': 'var(--bg-base)',
        'bg-darker': 'var(--bg-base)', // Fallback to base or define a darker var if needed
        'text-main': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
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
