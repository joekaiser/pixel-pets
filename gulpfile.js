'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var image = require('gulp-image');
var autoprefixer = require('gulp-autoprefixer');
var CacheBuster = require('gulp-cachebust');
var del = require('del');

var cachebust = new CacheBuster({
    random: false,
    checksumLength: 10
});

gulp.task('default', ['build-css', 'build-js', 'build-html'], function () {});

gulp.task('build-css', ['clean-dist'], function (cb) {
    pump([
        gulp.src('./public/style/*.scss'),
        sourcemaps.init(),
        sass(),
        autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }),
        concat('site-style.css'),
        cleanCSS(),
        //cachebust.resources(),
        sourcemaps.write('./'),
        gulp.dest('./public/dist')
    ],
        cb
    );
});

gulp.task('build-js', ['clean-dist'], function (cb) {
    pump([
        gulp.src(['./public/app.js', './public/**/*.js']),
        sourcemaps.init(),
        concat('site-scripts.js'),
        uglify(),
        //cachebust.resources(),
        sourcemaps.write('./'),

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

gulp.task('clean-dist', function (cb) {

    return del(['./site/dist/site-*']);

});



gulp.task('build-html', ['clean-dist', 'build-css', 'build-js'], function (cb) {
    /*disabling this task because it doesn't seem to like reading/writing to the same file.
    it works the first time, but any other run wont pick up the reference
    becuase the tag would read <script src="/dist/site-scripts-1234567890.js"></script> */

    //    pump([
    //        gulp.src('./views/*.html'),
    //        cachebust.references(),
    //        gulp.dest('./views')
    //    ],
    //        cb
    //    );
});
