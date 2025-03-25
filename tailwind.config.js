import daisyui from "daisyui";
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [daisyui, flowbite.plugin()],
  daisyui: {
    themes: ["light", "dark"],
  },
};
