/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Red Hat Display"', "sans-serif"],
        secondary: ['"Lora"', "serif"],
      },
    },
  },
  plugins: [],
};
