/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Red Hat Display"', "sans-serif"],
        secondary: ['"Lora"', "serif"],
      },
      colors: {
        primary: "#63130C",
        textGrey: "#828DA9",
        strokeGrey: "#9DA3AA",
        strokeGreyTwo: "#E0E0E0",
      },
      backgroundImage: {
        primaryGradient: "linear-gradient(to right, #982214, #F8CB48)",
      },
    },
  },
  plugins: [],
};
