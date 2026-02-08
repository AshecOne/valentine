/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        nyan: {
          pink: '#FF66CC',
          purple: '#CC66FF',
          blue: '#6699FF',
          cyan: '#66FFFF',
          green: '#66FF99',
          yellow: '#FFFF66',
          orange: '#FF9966',
          red: '#FF6666',
          dark: '#003366',
          space: '#001122',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'rainbow': 'rainbow 3s linear infinite',
        'fly': 'fly 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        fly: {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(100vw)' },
        }
      }
    },
  },
  plugins: [],
}
