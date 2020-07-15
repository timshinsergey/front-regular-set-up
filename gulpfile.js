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

const config = {
    paths: {
        base: './',
        entry: {
            js: {
                main: 'src/scripts/main.js',
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
            commonScss: 'src/scss/main.scss',
            scssByPage: 'src/scss/views/*',
            imgs: 'src/images/**/*'
        },
        output: {
            js: 'assets/scripts',
            css: 'assets/css',
            imgs: 'assets/images'
        },
        watch: {
            scss: 'src/scss/**/*.scss',
            js: 'src/scripts/**/*.js',
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

gulp.task('main-js', function () {
    return gulp
        .src(config.paths.entry.js.main)
        .pipe(uglify())
		.pipe(gulp.dest(config.paths.output.js))
		.pipe(browserSync.stream())
})
//
gulp.task('libs-js', function () {
    return gulp
        .src(config.paths.entry.js.libs)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.output.js))
})
// для сборки стилей сайта для всего сайта
gulp.task('bundle-css', function () {
    return gulp
        .src(config.paths.entry.commonScss)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
        .pipe(autoprefixer(['last 2 versions']))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(config.paths.output.css))
        .pipe(browserSync.stream())
})
// для сборки стилей постранично
// например: src/scss/views/index.scss - для главной страницы, выходной файл - index.css
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

gulp.task('imagemin', function () {
	return gulp
		.src(config.paths.entry.imgs)
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(gulp.dest(config.paths.output.imgs))
})

gulp.task('watch', function () {
    gulp.watch(config.paths.watch.scss, gulp.series('bundle-css'))
    gulp.watch(config.paths.watch.js, gulp.series('libs-js'))
    gulp.watch(config.paths.watch.js, gulp.series('main-js'))
})

gulp.task('build', gulp.parallel('bundle-css', 'libs-js', 'main-js'))

gulp.task('default', gulp.parallel('browser-sync', 'watch'))