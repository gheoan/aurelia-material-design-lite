var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');

var typescriptCompilerOptions = require('../../tsconfig.json').compilerOptions;
var tsb = require('gulp-tsb');
// create a new compiler every time
function typescript() { return tsb.create(typescriptCompilerOptions)(); }

gulp.task('build-html-es6', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-es6', ['build-html-es6'], function () {
  return gulp.src(paths.source)
    .pipe(typescript())
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-html-commonjs', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-commonjs', ['build-html-commonjs'], function () {
  return gulp.src(paths.source)
    .pipe(typescript())
    .pipe(to5(assign({}, compilerOptions, {modules:'common'})))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-html-amd', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-amd', ['build-html-amd'], function () {
  return gulp.src(paths.source)
    .pipe(typescript())
    .pipe(to5(assign({}, compilerOptions, {modules:'amd'})))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-html-system', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-system', ['build-html-system'], function () {
  return gulp.src(paths.source)
    .pipe(typescript())
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-es6', 'build-commonjs', 'build-amd', 'build-system'],
    callback
  );
});
