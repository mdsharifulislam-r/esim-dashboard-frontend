/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#009A54',
        'primary-light': '#00b863',
        'primary-dark': '#007a42',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Avoid conflict with antd
  },
}
