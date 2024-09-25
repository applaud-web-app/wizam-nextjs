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
          light: '#66aed3',    // Lighter shade of #3394c6
          DEFAULT: '#3394c6',  // Your main primary color
          dark: '#28759a',     // Darker shade of #3394c6
        },
        secondary: {
          light: '#94c94e',    // Lighter shade of #76b51b
          DEFAULT: '#76b51b',  // Your main secondary color
          dark: '#5b8614',     // Darker shade of #76b51b
        },
      },
    },
  },
 plugins: [
	require("tailgrids/plugin"), require('flowbite/plugin'), flowbite.plugin(),
	],
};
export default config;
