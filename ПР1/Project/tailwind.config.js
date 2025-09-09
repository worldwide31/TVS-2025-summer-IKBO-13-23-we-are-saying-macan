/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#364958',
        'blue': '#3b6064',
        'teal': '#55828b',
        'light-green': '#87bba2',
        'pale-green': '#c9e4ca',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};