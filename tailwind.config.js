/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify paths to all files where you will use Tailwind classes
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        revalia: ["Revalia-Regular"],
      },
    },
  },
  plugins: [],
};
