var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var debug = require('gulp-debug');

gulp.task('minify-js', function () {
    return gulp.src('js/app.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/'))
        .pipe(debug({
            title: 'Minificar JS'
        }));
});

gulp.task('minify-css', function () {
    return gulp.src('css/style.css')
        .pipe(concat('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('build/'))
        .pipe(debug({
            title: 'Minificar CSS'
        }));
});

gulp.task('typescript', function () {
    return gulp.src('ts/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'extend.js'
        }))
        .pipe(gulp.dest('js/'))
        .pipe(debug({
            title: 'Compilar TS'
        }));
});

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css/'))
        .pipe(debug({
            title: 'Compilar SASS'
        }));
});

gulp.task('watch', function () {
    gulp.watch('css/*.css', gulp.series('minify-css'), gulp.on('change', browserSync.reload));
    gulp.watch('js/*.js', gulp.series('minify-js'), gulp.on('change', browserSync.reload));
    gulp.watch('ts/*.ts', gulp.series('typescript'), gulp.on('change', browserSync.reload));
    gulp.watch('sass/*.sass', gulp.series('sass'), gulp.on('change', browserSync.reload));
});