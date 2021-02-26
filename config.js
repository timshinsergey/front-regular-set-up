const BASE_DIR = ".";

module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		domain: "",
		port: 9050,
		svgsymbol: {
			mode: {
				symbol: {
					transform: ["svgo"],
					svg: {
						// General options for created SVG files
						xmlDeclaration: false, // Add XML declaration to SVG sprite
						doctypeDeclaration: false, // Add DOCTYPE declaration to SVG sprite
						namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
						namespaceIDPrefix: "", // Add a prefix to the automatically generated namespaceIDs
						namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
						dimensionAttributes: true, // Width and height attributes on the sprite
					},
					dest: "./",
				},
			},
		},
		svgview: {
			mode: {
				view: {
					transform: ["svgo"],
					svg: {
						// General options for created SVG files
						xmlDeclaration: false, // Add XML declaration to SVG sprite
						doctypeDeclaration: false, // Add DOCTYPE declaration to SVG sprite
						namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
						namespaceIDPrefix: "", // Add a prefix to the automatically generated namespaceIDs
						namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
						dimensionAttributes: true, // Width and height attributes on the sprite
					},
					layout: "vertical",
					dest: "./",
					bust: false,
				},
			},
		},
	},
	paths: {
		base: `${BASE_DIR}/includes/**/*.php`,
		entry: {
			js: [
				// // Дейтпикер
				// 'node_modules/flatpickr/dist/flatpickr.min.js',
				// 'node_modules/flatpickr/dist/l10n/ru.js',
				// // Лайтбокс
				// `${BASE_DIR}/src/vendors/fslightbox/fslightbox.js`,
				// // Маска
				// "node_modules/imask/dist/imask.min.js",
				// Тултип
				// "node_modules/@popperjs/core/dist/umd/popper.min.js",
				// // Ленивая загрузка
				"node_modules/lazysizes/lazysizes.min.js",
				// // Валидация формы
				// "node_modules/pristinejs/dist/pristine.min.js",
				// // Слайдер
				// "node_modules/swiper/swiper-bundle.min.js",
				// `${BASE_DIR}/src/vendors/select2/select2.min.js`,
				`${BASE_DIR}/src/js/main.js`,
			],
			css: `${BASE_DIR}/src/css/*.css`,
			imgs: `${BASE_DIR}/src/imgs/**/*`,
			svgSymbol: `${BASE_DIR}/src/imgs/svg/symbol/**/*.svg`,
			svgView: `${BASE_DIR}/src/imgs/svg/view/**/*.svg`,
			allcss: `${BASE_DIR}/src/css/**/*.css`,
		},
		output: {
			js: `${BASE_DIR}/assets/js`,
			css: `${BASE_DIR}/assets/css`,
			imgs: `${BASE_DIR}/assets/imgs`,
		},
		watch: {
			css: `${BASE_DIR}/src/css/**/*.css`,
			js: `${BASE_DIR}/src/js/**/*.js`,
		},
	},
};
