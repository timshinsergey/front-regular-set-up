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

const config = {
    paths: {
        base: './',
        entry: {
            js: 'src/js/*.js',
            scss: 'src/scss/*.scss',
            imgs: 'src/imgs/**/*',
            svgSymbol: 'src/imgs/svg/symbol/*.svg',
            svgView: 'src/imgs/svg/view/*.svg',
        },
        output: {
            js: 'assets/js',
            css: 'assets/css',
            imgs: 'assets/imgs',    
        },
        watch: {
            scss: 'src/scss/**/*.scss',
            js: 'src/js/**/*.js',
            html: '**/*.html',
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
// для поддержки импортов/экспортов
gulp.task('js', function () {
    return gulp
        .src(config.paths.entry.js)
        .pipe(named())
        .pipe(webpack({ output: { filename: '[name].js' } }))
        .pipe(uglify())
		.pipe(gulp.dest(config.paths.output.js))
		.pipe(browserSync.stream())
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
    gulp.watch(config.paths.watch.js, gulp.series('js'))
})

//все полностью собираем
gulp.task('build', gulp.parallel('scss', 'js'))

gulp.task('default', gulp.parallel('browser-sync', 'watch'))