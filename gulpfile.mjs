import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import prefix from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import terser from 'gulp-terser';
import flatmap from 'gulp-flatmap';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imagewebp from 'gulp-webp';
import usemin from 'gulp-usemin';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import { deleteAsync } from 'del';
import bs from 'browser-sync';
const browserSync = bs.create();

export function sassTask() {
    return src('./assets/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./assets/css'));
}

function compilescss() {
    return src('assets/sass/*.scss')
    .pipe(sass())
    .pipe(prefix())
    .pipe(cleanCss())
    .pipe(dest('./assets/css'));
}

function copyFonts() {
    return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
}

function optimizeimg() {
    return src('assets/img/*.{jpg,png,gif}')
    .pipe(imagemin([
        imageminMozjpeg({ quality: 80, progressive: true}),
        imageminOptipng({ optimizationLevel: 2 })
    ]))
    .pipe(dest('dist/img'));
}

function webpImage() {
    return src('dist/img/*.{jpg,png,gif}')
    .pipe(imagewebp())
    .pipe(dest('dist/img'))
}

function clean() {
    return deleteAsync(['dist']);
}

function useminTask() {
    return gulp.src('*.html')
        .pipe(flatmap(function (stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [htmlmin({ collapseWhitespace: true })],
                    js: [terser(), rev()],
                    inlinejs: [terser()],
                    inlinecss: ['concat']
                }))
        }))
        .pipe(gulp.dest('dist/'));
}

function browserSyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    cb();
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

function watchTask () {
    watch(['*.html', 'assets/js/*.js'], series(browserSyncReload));
    watch('assets/sass/*.scss', series(sassTask, browserSyncReload));
}

export const build = series(
    clean,
    copyFonts,
    compilescss,
    optimizeimg,
    webpImage,
    useminTask
);

export default series(
    sassTask,
    browserSyncServe,
    watchTask
);