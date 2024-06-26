const { addDynamicIconSelectors } = require("@iconify/tailwind");
const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./assets/*.{html,js}", "./*.html"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	daisyui: {
		themes: [
			{
				lightdim: {
					"color-scheme": "light",
					neutral: "#4C566A",
					"neutral-content": "#D8DEE9",
					"base-100": "#ECEFF4",
					"base-200": "#E5E9F0",
					"base-300": "#D8DEE9",
					"base-content": "#2E3440",
				},
			},
			"dark",
		],
	},
	darkMode: ["selector", '[data-theme="dark"]'],
	plugins: [require("@tailwindcss/typography"), addDynamicIconSelectors(), require("daisyui")],
};
//* npx tailwindcss -i ./assets/tailwind.css -o ./assets/style.css --watch
