var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var debug = require('gulp-debug');

gulp.task('minify-js', function () {
    return gulp.src('src/js/app.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(debug({
            title: 'Minificar JS'
        }));
});

gulp.task('minify-css', function () {
    return gulp.src('dist/css/style.css')
        .pipe(concat('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/'))
        .pipe(debug({
            title: 'Minificar CSS'
        }));
});

gulp.task('typescript', function () {
    return gulp.src('src/ts/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'extend.js'
        }))
        .pipe(gulp.dest('src/js/'))
        .pipe(debug({
            title: 'Compilar TS'
        }));
});

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('src/styles/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css/'))
        .pipe(debug({
            title: 'Compilar SASS'
        }));
});

gulp.task('watch', function () {
    gulp.watch('dist/css/*.css', gulp.series('minify-css'), gulp.on('change', browserSync.reload));
    gulp.watch('src/js/*.js', gulp.series('minify-js'), gulp.on('change', browserSync.reload));
    gulp.watch('src/ts/*.ts', gulp.series('typescript'), gulp.on('change', browserSync.reload));
    gulp.watch('src/styles/*.sass', gulp.series('sass'), gulp.on('change', browserSync.reload));
});