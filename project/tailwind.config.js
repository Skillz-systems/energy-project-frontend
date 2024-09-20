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
        textBlack: "#050505",
        textGrey: "#828DA9",
        textDarkGrey: "#49526A",
        textDarkBrown: "#32290E",
        strokeGrey: "#9DA3AA",
        strokeGreyTwo: "#E0E0E0",
        strokeGreyThree: "#EAEEF2",
        strokeCream: "#D3C6A1",
        error: "#EA91B4",
      },
      backgroundImage: {
        primaryGradient: "linear-gradient(to right, #982214, #F8CB48)",
      },
      boxShadow: {
        innerCustom: "inset 1px 2px 4px rgba(0, 0, 0, 0.15)",
        menuCustom: "8px 12px 40px rgba(0, 0, 0, 0.15)",
        titlePillCustom: "1px 2px 10px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
