import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
 
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          light: '#7FFFF0',    // Lighter shade of primary color
          DEFAULT: '#2AFFD4',  // Main primary color
          dark: '#1ef1c6',     // Darker shade of primary color
        },
        secondary: {
          light: '#7986B3',    // Lighter shade of secondary color
          DEFAULT: '#2E3C71',  // Main secondary color
          dark: '#1F274D',     // Darker shade of secondary color
        },
        tertiary: {
          light: '#4C5DA0',    // Lighter shade of tertiary color
          DEFAULT: '#0E1F5B',  // Main tertiary color (as requested)
          dark: '#0A1744',     // Darker shade of tertiary color
        },
      },
    },
  },
 plugins: [
	require("tailgrids/plugin"), require('flowbite/plugin'), flowbite.plugin(),
	],
};
export default config;
