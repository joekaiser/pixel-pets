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
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var nodemon = require('gulp-nodemon');

var cachebust = new CacheBuster({
    random: false,
    checksumLength: 10
});

var defaultTasks = ['build-css', 'build-js', 'build-html'];

gulp.task('default', defaultTasks, function () {});

gulp.task('build-css', ['clean-dist'], function (cb) {
    pump([
        gulp.src('./www/style/*.scss'),
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
        gulp.dest('./www/dist')
    ],
        cb
    );
});

gulp.task('build-js', ['clean-dist'], function (cb) {
    pump([

        gulp.src(['./www/app.js', './www/**/*.js']),
        sourcemaps.init(),
        concat('site-scripts.js'),
        gulpif(argv.production, uglify()),
        //cachebust.resources(),
        sourcemaps.write('./'),

        gulp.dest('./www/dist')
    ],
        cb
    );
});

gulp.task('optimizeImages', function (cb) {
    pump([
        gulp.src('./www/assets/*'),
        image(),
        gulp.dest('./www/assets')
    ],
        cb
    );
});

gulp.task('clean-dist', function (cb) {

    return del(['./www/dist/site-*']);

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

gulp.task('serv', function () {
    nodemon({
            script: 'server.js',
            ext: 'html js',
            ignore: ['www/dist/'],
            tasks: ['default']
        })
        .on('restart', function () {
            console.log('restarted!')
        })
});
