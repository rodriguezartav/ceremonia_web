var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');
var revall = require('gulp-rev-all');
var clean = require('gulp-clean');
var p = require('../../package.json');
var manifest = require("gulp-manifest");
var gp_sourcemaps = require('gulp-sourcemaps');

var deploy = require("../../deploy");

gulp.task('clean', ['build'], function() {
    return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('./build/**')
    .pipe(revall({
        ignore: [/^\/favicon.ico$/g, /^\/index.html/g],
        prefix: "http://" + deploy.bucket + "/" + deploy.folder
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', [ 'copy'], function() {
    gulp.src(['./dist/**/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));

    gulp.src('./dist/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));

    return gulp.src('./dist/*.js')
        .pipe(gp_sourcemaps.init())
        .pipe(uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});