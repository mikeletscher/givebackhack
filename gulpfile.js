var gulp = require('gulp');

var coffeelint = require('gulp-coffeelint');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var uglifycss = require('gulp-uglifycss');
var gutil = require('gulp-util');
var haml = require('gulp-haml');
var deploy = require('gulp-gh-pages');
var wrap = require('gulp-wrap');

// HAML
gulp.task('haml', function () {
  return gulp.src(['./haml/*.haml', './haml/pages/*.haml'])
    .pipe(haml())
    .pipe(gulp.dest('.tmp'));
});

// Layout
gulp.task('wrap', ['haml'], function() {
  return gulp.src(['.tmp/*.html', '!.tmp/layout.html'])
    .pipe(wrap({ src: '.tmp/layout.html' }))
    .pipe(gulp.dest('./build/'));
});

// Lint
gulp.task('lint', function () {
  return gulp.src('./js/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
});

// Sass
gulp.task('sass', function() {
  return gulp.src('./css/*.scss')
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('./build/'));
});

// Coffeescript
gulp.task('scripts', ['lint'], function() {
  return gulp.src('./js/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(addsrc.prepend(['./js/vendor/jquery.js', './js/vendor/*.js']))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/'))
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('fonts/*', ['fonts']);
  gulp.watch('img/*', ['images']);
  gulp.watch('haml/*.haml', ['wrap']);
  gulp.watch('js/*', ['scripts']);
  gulp.watch('css/**/*.scss', ['sass']);
  gulp.watch('css/*.scss', ['sass']);
});

// Deploy to GH pages
gulp.task('deploy', ['images', 'fonts', 'wrap', 'sass', 'scripts'], function () {
  return gulp.src(['./build/*', './build/**/*', 'CNAME'])
    .pipe(deploy())
});

// Copy fonts
gulp.task('fonts', function(){
  gulp.src('./fonts/*')
  .pipe(gulp.dest('./build/fonts/'));
});

// Copy images
gulp.task('images', function(){
  gulp.src('./img/*')
    .pipe(gulp.dest('./build/img/'));
});

// Build for deploy
gulp.task('build', function(callback) {
  return gulp.start('images', 'fonts', 'wrap', 'sass', 'scripts');
});

gulp.task('default', ['wrap', 'fonts', 'images', 'sass', 'scripts', 'watch']);
