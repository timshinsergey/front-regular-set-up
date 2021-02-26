const BASE_DIR = "./";

module.exports = {
	darkMode: false, // or 'media' or 'class'
	purge: {
		enabled: true,
		content: [
			`${BASE_DIR}/src/js/**/*.js`,
			`${BASE_DIR}/includes/**/*.php`,
		],
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ["Open Sans"],
				serif: ["Montserrat"],
			},
			fontSize: {
				xss: "0.5rem",
				xs: "0.75rem",
				ssm: "0.8125rem",
				sm: "0.875rem",
				base: "1rem",
				lg: "1.125rem",
				xl: "1.25rem",
				"2xl": "1.5rem",
				"3xl": "2rem",
				"4xl": "2.5rem",
				"5xl": "3rem",
				"6xl": "3.5rem",
				"7xl": "4.5rem",
				"8xl": "6rem",
				"9xl": "8rem",
			},
			borderRadius: {
				sm: "0.1875rem",
				DEFAULT: "0.3125rem",
			},
			colors: {
				green: {
					300: "#72FF00",
					400: "#64E000",
					500: "#54BD00",
				},
				gray: {
					100: "#F6F7FB",
					500: "#B7B7B7",
					600: "#979797",
					700: "#4C5450",
					800: "#00240C",
				},
				red: {
					500: "#EF1E2A",
				},
				black: "#0A0B11",
			},
			spacing: {
				3: "0.875rem",
				13: "3.25rem",
				15: "3.75rem",
				17: "4.25rem",
				18: "4.5rem",
				19: "4.75rem",
			},
			screens: {
				"3xl": "1920px",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
