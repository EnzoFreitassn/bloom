/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#2E0C32', // Darker shade for contrast
          DEFAULT: '#4A1650', // Primary plum purple
          light: '#6E2D75', // Lighter purple
          gold: '#C9A84C', // Primary gold
          goldDark: '#A68635', // Darker gold for hovers
          cream: '#F9F6F0', // Off-white for backgrounds
          gray: '#F3F4F6', // Neutral light gray
          charcoal: '#333333', // Dark text
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'], // Elegant titles
        sans: ['Inter', 'sans-serif'], // Clean body text
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
