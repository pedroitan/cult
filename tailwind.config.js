/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6b46c1',
        secondary: '#b794f4',
        background: '#3F2A8C',
        dark: '#1C1240'
      },
    },
  },
  plugins: [],
};
