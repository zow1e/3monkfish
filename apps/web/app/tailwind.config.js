/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9a4345",
        "primary-container": "#ef8686",
        "primary-fixed": "#ffdad8",
        secondary: "#5b5d70",
        "secondary-container": "#dddef5",
        "secondary-fixed": "#e0e1f8",
        tertiary: "#6c5b50",
        "tertiary-container": "#b5a093",
        background: "#f9f9f9",
        surface: "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "outline-variant": "#dbc0bf",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#181b2b",
        "on-secondary-fixed-variant": "#434658",
        "soft-peach": "#f5decf",
        "muted-green": "#b5a093"
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        '5': '1.7rem',
        '8': '2.5rem',
        '10': '3rem',
      },
      borderRadius: {
        'md': '1.5rem',
        'xl': '3rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
