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
            js: {
                main: 'src/js/main.js',
                libs: [
                    // слайдер
                    'src/vendors/swiper/swiper.min.js',
                    // ленивая загрузка медиаконтента(картинки, видео с ютуб, карты и тд)
                    'src/vendors/lazysizes.min.js',
                    // акцентирование внимания на медиаконтенте
                    // с затемнением всего остального
                    'src/vendors/fslightbox.js',
                    // создание масок, например, чтобы
                    // в инпуте телефона вводилось в формате
                    // +7 (999) 999-99-99
                    'src/vendors/imask.js',
                    // валидация формы
                    'src/vendors/pristine.min.js',
                    // кастомное решение
                    // для удобного ввода даты, времени
                    // с русской локализацией
                    'src/vendors/flatpickr/flatpickr.min.js',
                    'src/vendors/flatpickr/l10n/ru.js',
                ],
            },
            commonScss: 'src/scss/common.scss',
            scssByPage: 'src/scss/views/*',
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
gulp.task('main-js', function () {
    return gulp
        .src(config.paths.entry.js.main)
        .pipe(uglify())
		.pipe(gulp.dest(config.paths.output.js))
		.pipe(browserSync.stream())
})

// компилим либы в один бандл жс
gulp.task('libs-js', function () {
    return gulp
        .src(config.paths.entry.js.libs)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.output.js))
})

// компилим общий css
gulp.task('common-css', function () {
    return gulp
        .src(config.paths.entry.commonScss)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 2 versions']))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.paths.output.css))
        .pipe(browserSync.stream())
})

// компилим css для страниц
// например: src/scss/views/index.scss - для главной страницы, выходной файл - index.css
//			src/scss/views/product-page.scss - для страницы продукта, выходной файл - product-page.css и тд
gulp.task('css-by-page', function () {
    return gulp
        .src(config.paths.entry.scssByPage)
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
    gulp.watch(config.paths.watch.scss, gulp.series('common-css', 'css-by-page'))
    gulp.watch(config.paths.watch.js, gulp.series('libs-js', 'main-js'))
})

//все полностью собираем
gulp.task('build', gulp.parallel('common-css', 'css-by-page', 'libs-js', 'main-js'))

gulp.task('default', gulp.parallel('browser-sync', 'watch'))