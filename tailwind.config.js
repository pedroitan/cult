/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1C1240',
        dark: '#2A1F5C',
        primary: '#2563eb',
        secondary: '#6c757d',
      },
    },
  },
  plugins: [],
};
