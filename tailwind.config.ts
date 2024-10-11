import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    ...flowbite.content(), // Spread to include flowbite content
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)", // CSS variable for background
        foreground: "var(--foreground)", // CSS variable for foreground
        primary: {
          light: '#7FFFE4',   // Lighter shade of #2AFFD4
          DEFAULT: '#2AFFD4', // Main primary color
          dark: '#1cf1c6',    // Darker shade of #2AFFD4
        },
        secondary: {
          light: '#94c94e',   // Lighter shade of #76b51b
          DEFAULT: '#76b51b', // Main secondary color
          dark: '#5b8614',    // Darker shade of #76b51b
        },
        // Add the custom dark color for the `text-dark` class
        dark: '#2E3C71', // You can change this to your desired dark color
      },
    },
  },

  plugins: [
    require("tailgrids/plugin"), 
    require('flowbite/plugin'), 
    flowbite.plugin(),
  ],
};

export default config;
