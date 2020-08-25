const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const webpack = require('webpack-stream');
const named = require('vinyl-named');

const svgViewConfig = {
    mode: {
		view: {
			transform: ['svgo'],
			svg: { // General options for created SVG files
				xmlDeclaration: false, // Add XML declaration to SVG sprite
				doctypeDeclaration: false, // Add DOCTYPE declaration to SVG sprite
				namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
				namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
				namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
				dimensionAttributes: true, // Width and height attributes on the sprite
			},
			layout: 'vertical',
			dest: './',
			bust: false
		}
	}
}

const svgSymbolConfig = {
    mode: {
		symbol: {
			transform: ['svgo'],
			svg: { // General options for created SVG files
				xmlDeclaration: false, // Add XML declaration to SVG sprite
				doctypeDeclaration: false, // Add DOCTYPE declaration to SVG sprite
				namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
				namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
				namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
				dimensionAttributes: true, // Width and height attributes on the sprite
			},
			dest: './',
		}
	}
}
const BASE_DIR = ''

const config = {
	paths: {
		//base: 'assets',
		entry: {
			js: {
				main: [
					`${BASE_DIR}src/js/main.js`,
				],
                vendors: [
                    // кастомное решение
                    // для удобного ввода даты, времени
                    // с русской локализацией
                    'node_modules/flatpickr/dist/flatpickr.min.js',
                    'node_modules/flatpickr/dist/l10n/ru.js',
                    // лайтбокс
                    'node_modules/fslightbox/index.js',
                    // создание масок, например, чтобы
                    // в инпуте телефона вводилось в формате
                    // +7 (999) 999-99-99
                    'node_modules/imask/dist/imask.min.js',
                    // ленивая загрузка медиаконтента(картинки, видео с ютуб, карты и тд)
                    'node_modules/lazysizes/lazysizes.min.js',
                    // валидация формы
                    'node_modules/pristinejs/dist/pristine.min.js',
                    // слайдер
                    'node_modules/swiper/swiper-bundle.min.js',
                ],
			},
			scss: `${BASE_DIR}src/scss/*.scss`,
			imgs: `${BASE_DIR}src/imgs/**/*`,
            svgSymbol: `${BASE_DIR}src/imgs/svg/symbol/*.svg`,
            svgView: `${BASE_DIR}src/imgs/svg/view/*.svg`
		},
		output: {
			js: `${BASE_DIR}assets/js`,
			css: `${BASE_DIR}assets/css`,
			imgs: `${BASE_DIR}assets/imgs`,
		},
		watch: {
			scss: `${BASE_DIR}src/scss/**/*.scss`,
			js: `${BASE_DIR}src/js/**/*.js`,
		}
	}
}

// Пользовательские скрипты проекта
gulp.task('browser-sync', function () {
    browserSync({
        // proxy: 'some.site',
        server: {
            baseDir: config.paths.base,
        },
        port: 3000,
        notify: false,
    })
})

// компилим скрипты
// webpack используется
// для поддержки импортов/экспортов(пока неактивно)
gulp.task('main-js', function () {
    return gulp
        .src(config.paths.entry.js.main)
        // .pipe(named())
        // .pipe(webpack({ output: { filename: '[name].js' } }))
        .pipe(uglify())
		.pipe(gulp.dest(config.paths.output.js))
		.pipe(browserSync.stream())
})

// собираем js библиотеки
// в один бандл
gulp.task('vendors-js', function () {
    return gulp
		.src(config.paths.entry.js.vendors)
		.pipe(concat('vendors.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.paths.output.js))
})

// компилим css для страниц
// например: src/scss/common.scss - общие стили для всего сайта, выходной файл - common.css
//           src/scss/index.scss - для главной страницы, выходной файл - index.css
//			 src/scss/product-page.scss - для страницы продукта, выходной файл - product-page.css и тд
gulp.task('scss', function () {
    return gulp
        .src(config.paths.entry.scss)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 2 versions']))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.paths.output.css))
        .pipe(browserSync.stream())
})

//сжимаем картинки
gulp.task('imagemin', function () {
	return gulp
		.src(config.paths.entry.imgs)
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest(config.paths.output.imgs))
})

// собираем свг иконки в один спрайт типа symbol
// вставляется в html
// пример вставки:
// <svg fill="none" viewBox="0 0 18 18"><use xlink:href="templates/assets/img/svg/sprite.symbol.svg#cross" /></svg>
gulp.task('svg-sprite-symbol', function () {
	return gulp
		.src(config.paths.entry.svgSymbol)
		.pipe(svgSprite(svgSymbolConfig))
		.pipe(gulp.dest(config.paths.output.imgs))
})

// собираем свг иконки в один спрайт типа view
// вставляется в css
// пример вставки:
// background-image: url(templates/assets/img/svg/sprite.view.svg#cross);
// либо background-image: url(templates/assets/img/svg/sprite.view.svg);
//		background-position: 35% 40%; - при помощи смены позиции ищем нужную иконку
gulp.task('svg-sprite-view', function () {
	return gulp
		.src(config.paths.entry.svgView)
		.pipe(svgSprite(svgViewConfig))
		.pipe(gulp.dest(config.paths.output.imgs))
})

//смотрим за изменением файлов и перекомпиливаем стили и скрипты
gulp.task('watch', function () {
    gulp.watch(config.paths.watch.scss, gulp.series('scss'))
    gulp.watch(config.paths.watch.js.main, gulp.series('main-js'))
})

//все полностью собираем
gulp.task('build', gulp.parallel('scss', 'main-js', 'vendors-js'))

//задачи по умолчанию при запуске галпа
gulp.task('default', gulp.parallel('browser-sync', 'watch'))