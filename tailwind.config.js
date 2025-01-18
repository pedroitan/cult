/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6b46c1', // Example color from the reference image
        secondary: '#b794f4', // Example color from the reference image
        background: '#1a202c', // Example background color
        // Add more colors as needed
      },
    },
  },
  plugins: [],
};
