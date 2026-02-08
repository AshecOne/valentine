/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valentine: {
          pink: '#ff69b4',
          red: '#ff1744',
          rose: '#ff6b9d',
          light: '#ffb3d9',
        }
      }
    },
  },
  plugins: [],
}
