'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default' ,['sass'],function(){
});
 
gulp.task('sass', function () {
  // return gulp.src('../public/content/site/less/*.scss')
  //   .pipe(sourcemaps.init())
  //   .pipe(sass().on('error', sass.logError))
  //   .pipe(sourcemaps.write())
  //   .pipe(gulp.dest('/tmp'));
});
 
// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// });

