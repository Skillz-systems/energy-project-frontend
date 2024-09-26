/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
       "./src/Pages/*.{js,ts,jsx,tsx}"
      ],
    

  
    theme: {
      fontFamily: {
        'sans': ['Lora', 'sans-serif'],
        'serif': ['Lora', 'serif'],
        'mono': ['Lora', 'monospace'],
      },
  
      extend: {
  
        colors: {
          "custom-blue-100": "#F6F8FA",
          "custom-blue-200": "#DADFF8",
          "custom-blue-300": "#8396E7",
          "custom-blue-400": "#F4F6FF",
          "custom-blue-500": "#22306D",
          "custom-grey-100": "#EAEEF2",
          "custom-grey-200": "#F3F4F7",
          "custom-grey-300": "#B3BACB",
          "primary-color": "#4561DB",
          "color-text-one": "#050505",
          "color-text-two": "#828DA9",
          "color-text-three": "#2E4192",
          "color-dark-red": "#D6236A",
          "color-light-red": "#F7D3E1",
          "color-light-green": "#E3FAD6",
          "color-bright-red": "#ED0027",
          "color-light-yellow": "#FFF3D5",
          "color-bright-orange": "#FFA02E",
          "color-bright-green": "#208D28",
          "color-text-black": "#49526A",
          "color-dark-green": "#2FA52D",
          "divider-grey": "#CCD0DC",
          "very-light-grey": "#F9F9F9",
          "blueberry": "#A2B0ED",
          "darkblueberry": "#3951B6",
          "darkerblueberry": "#172049",
          "lightblue": "#EFF2FF",
          "light-red": "#FFF7FA",
          "neon-green": "#C2F6AE",
          "light-neon-green": "#F7FFF2",
          "dark-green": "#094E2F",
          "document-grey": "#5E6974",
          "document-bg-grey": "#F3F4F7",
          "metal": "#303646",
          "faint-grey": "#959595",
          "custom-teal": "#17517E",
        },
        borderWidth: {
          1.5: "1.5px",
          0.6: "0.6px",
          0.5: "0.5px",
        },
        borderColor: (theme) => ({
          ...theme("colors"),
          "test-border": "red",
          "custom-color-one": "#E2E4EB",
          "custom-color-two": "#8396E7",
        }),
        boxShadow: {
          "custom-100": "2px 2px 6px 0px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    plugins: [require("tailwind-scrollbar")],
    corePlugins: {
      fontFamily: false, // Disable the default fontFamily core plugin
    },
    variants: {
      fontFamily: ["responsive", "hover", "focus"], // Enable fontFamily utility with responsive and hover variants
    },
  };
  