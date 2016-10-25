var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    pump = require('pump'),
    less = require('gulp-less'),
    path = require('path'),
    clean = require('gulp-clean'),
    del = require('del');

gulp.task('less', function () {
    return gulp.src('app/styles/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/tmp'));
});

gulp.task('clean-tmp-css', ['concat'], function () {
    del(['app/styles/tmp', 'dist/styles/tmp']);
});

gulp.task('jshint', function() {
    return gulp.src(['app/**/*.js', '!app/libs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('clean-dist', function() {
    return del(['dist']);
});

gulp.task('usemin',['jshint'], function () {
    return gulp.src('app/**/*.html')
        .pipe(usemin({
            styles:[minifycss(),rev()],
            js: [uglify(),rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src('app/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', function() {
    gulp.src('app/fonts/**/*.{ttf,woff,eof,svg,eot}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('dist/fonts/**/*.{ttf,woff,eof,svg,eot}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('minify-css', ['less'], function() {
    return gulp.src(['app/styles/tmp/*.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/styles/tmp'));
});

gulp.task('concat',['minify-css', 'usemin'], function() {
    return gulp.src(['./dist/styles/**/*.css'])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('app/*.js'),
            uglify(),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('copyJson', function() {
    gulp.src('app/**/*.json')
        .pipe(gulp.dest('./dist'));
});


gulp.task('watch', ['browser-sync'], function() {
    // Watch .js, .css, .html, .less files
    gulp.watch('{app/js/**/*.js, app/libs/**/*.js, app/styles/**/*.css, app/styles/**/*.less, app/**/*.html}', ['clean-tmp-css']);
    // Watch server.js
    gulp.watch('app/*.js', ['compress']);
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);
    // Watch font files
    gulp.watch('app/fonts/**/*', ['copyfonts']);
    // Watch json files
    gulp.watch('app/**/*', ['copyJson']);

});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
        'app/**/*.js',
        'app/**/*/json',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: 'dist',
            index: 'index.html'
        }
    });
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});


// Default task
gulp.task('default', ['clean-dist'], function() {
    gulp.start( 'imagemin','copyfonts', 'compress', 'copyJson', 'clean-tmp-css');
});
