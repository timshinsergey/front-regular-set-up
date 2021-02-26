const gulp = require("gulp");
const concat = require("gulp-concat");
const notify = require("gulp-notify");
const sync = require("browser-sync");
const options = require("./config");

// для сборки жс
const uglify = require("gulp-uglify-es").default;

// для работы с цсс
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const atImport = require("postcss-import");
const cssnano = require("cssnano");
const doiuse = require("doiuse");
const nested = require("postcss-nested");
const postcssCustomProperties = require("postcss-custom-properties");

// для работы с изображениями
const imagemin = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");

const server = () => {
	sync.init({
		ui: false,
		notify: false,
		proxy: options.config.domain,
		// port: options.config.port || 5000,
		// server: {
		// 	baseDir: options.paths.base,
		// 	notify: false,
		// }
	});
};
exports.server = server;

// компилим жс
const js = () => {
	return gulp
		.src(options.paths.entry.js)
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(gulp.dest(options.paths.output.js))
		.pipe(sync.stream());
};
exports.js = js;

//компилим css
const css = () => {
	let plugins = [
		atImport(),
		tailwindcss(options.config.tailwindjs),
		nested(),
		postcssCustomProperties(),
		autoprefixer(),
		// cssnano(),
	];
	return gulp
		.src(options.paths.entry.css)
		.pipe(postcss(plugins))
		.pipe(gulp.dest(options.paths.output.css))
		.pipe(sync.stream());
};
exports.css = css;

// лог поддержки цсс браузерами
const cssSupport = () => {
	let plugins = [
		nested(),
		autoprefixer(),
		doiuse({
			browsers: ["last 2 versions"],
			ignore: ["rem"], // an optional array of features to ignore
			onFeatureUsage: function (usageInfo) {
				console.log(usageInfo.message);
			},
		}),
	];
	return gulp.src(options.paths.entry.allcss).pipe(postcss(plugins));
};
exports.cssSupport = cssSupport;

//сжимаем картинки
const imageMin = () => {
	return gulp
		.src(options.paths.entry.imgs)
		.pipe(
			imagemin([
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
			])
		)
		.pipe(gulp.dest(options.paths.output.imgs));
};
exports.imageMin = imageMin;

// собираем свг иконки в один спрайт типа symbol
// вставляется в html
// пример вставки:
// <svg fill="none" viewBox="0 0 18 18"><use xlink:href="templates/assets/img/svg/sprite.symbol.svg#cross" /></svg>
const svgSpriteSymbol = () => {
	return gulp
		.src(options.paths.entry.svgSymbol)
		.pipe(svgSprite(options.config.svgsymbol))
		.pipe(gulp.dest(options.paths.output.imgs));
};
exports.svgSpriteSymbol = svgSpriteSymbol;

// собираем свг иконки в один спрайт типа view
// вставляется в css
// пример вставки:
// background-image: url(templates/assets/img/svg/sprite.view.svg#cross);
// либо background-image: url(templates/assets/img/svg/sprite.view.svg);
//		background-position: 35% 40%; - при помощи смены позиции ищем нужную иконку
const svgSpriteView = () => {
	return gulp
		.src(options.paths.entry.svgView)
		.pipe(svgSprite(options.config.svgview))
		.pipe(gulp.dest(options.paths.output.imgs));
};
exports.svgSpriteView = svgSpriteView;

//смотрим за изменением файлов и перекомпиливаем стили и скрипты
const watch = () => {
	gulp.watch(options.paths.watch.css, gulp.series(css));
	gulp.watch(options.paths.watch.js, gulp.series(js));
};
exports.watch = watch;

//сжимаем, собираем изображения/иконки
exports.optimizeImg = gulp.parallel(imageMin, svgSpriteView, svgSpriteSymbol);

//все полностью собираем
exports.build = gulp.parallel(css, js);

//задачи по умолчанию при запуске галпа
exports.default = gulp.parallel(server, watch);
