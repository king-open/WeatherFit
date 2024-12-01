/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38B2AC',
          light: '#4FD1C5',
          dark: '#319795',
        },
        secondary: {
          DEFAULT: '#805AD5',
          light: '#9F7AEA',
          dark: '#6B46C1',
        }
      },
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
      textColor: theme => ({
        ...theme('colors'),
      }),
      ringColor: theme => ({
        ...theme('colors'),
      }),
    },
  },
  plugins: [],
  safelist: [
    'bg-primary-light',
    'bg-primary-dark',
    'bg-secondary-light',
    'bg-secondary-dark',
    'text-primary-light',
    'text-primary-dark',
    'ring-primary-light',
    'hover:bg-primary-dark',
    'hover:bg-secondary-dark',
    'hover:text-primary-dark',
  ],
}

