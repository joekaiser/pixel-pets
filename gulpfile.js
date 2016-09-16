'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var image = require('gulp-image');

var defaultTasks = ['sass', 'uglify']

gulp.task('default', defaultTasks, function () {});

//gulp.task('sass', function () {
//    
//    
//   return gulp.src('./public/content/sass/*.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass().on('error', sass.logError))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('./public/dist/'));
//});

gulp.task('sass', function (cb) {
    pump([
        gulp.src('./public/style/*.scss'),
        sourcemaps.init(),
        sass(),
        concat('style.css'),
        cleanCSS(),
        sourcemaps.write(),
        gulp.dest('./public/dist')
    ],
        cb
    );
});

gulp.task('uglify', function (cb) {
    pump([
        gulp.src('./public/**/*.js'),
        sourcemaps.init(),
        concat('site.js'),
        sourcemaps.write(),
        uglify(),

        gulp.dest('./public/dist')
    ],
        cb
    );
});

gulp.task('optimizeImages', function (cb) {
    pump([
        gulp.src('./public/assets/*'),
        image(),
        gulp.dest('./public/assets')
    ],
        cb
    );
});
