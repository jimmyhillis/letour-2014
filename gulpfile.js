/**
 * Gulp build
 *
 * Build process for developing a SASS + Angular/JS web application.
 * Default build for development will watch and recompile, with debug
 * information on each change of local styleheets + javascript files.
 *
 * For usage information see README.md for this project.
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var jshint = require('gulp-jshint-cached');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');

// Configuration
var config = {
  stylesheets: './public/stylesheets',
  scripts: './public/scripts',
  templates: './public/templates',
  vendor: './public/vendor',
};

// Remove all existing compiled files
gulp.task('clean', function () {
  gulp.src([config.stylesheets + '/*.css', config.scripts + '/*min.js'])
    .pipe(clean({ force: true, read: false }));
});

// Find Javascript errors and bugs
gulp.task('lint', function () {
  gulp.src([config.scripts + '/*.js', '!' + config.scripts + '/*-min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile modularized SCSS into single CSS stylesheet
gulp.task('styles', function () {
  gulp.src(config.stylesheets + '/scss/styles.scss')
    .pipe(plumber())
    .pipe(compass({
      css: config.stylesheets,
      sass: config.stylesheets + '/scss',
      outputStyle: 'expanded',
      debugInfo: true
    }))
    .pipe(autoprefixer("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(config.stylesheets));
});

// Compile SCSS into CSS stylesheet
gulp.task('styles', function () {
  gulp.src(config.stylesheets + '/scss/styles.scss')
    .pipe(plumber())
    .pipe(compass({
      css: config.stylesheets,
      sass: config.stylesheets + '/scss',
      outputStyle: 'expanded',
      debugInfo: true
    }))
    .pipe(autoprefixer("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(config.stylesheets));
});

// Compile SCSS and minify into CSS stylesheet
gulp.task('ugly-styles', function () {
  gulp.src(config.stylesheets + '/scss/styles.scss')
    .pipe(plumber())
    .pipe(compass({
      css: config.stylesheets,
      sass: config.stylesheets + '/scss',
      outputStyle: 'compressed',
      debugInfo: false
    }))
    .pipe(autoprefixer("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(minify())
    .pipe(gulp.dest(config.stylesheets));
});


// Concat all script files required into `all.min.js`
gulp.task('scripts', function () {
  gulp.src([
    config.vendor + '/angular/angular.js',
    config.vendor + '/angular-resource/angular-resource.js',
    config.vendor + '/hammerjs/hammer.js',
    config.vendor + '/angular-hammer/angular-hammer.js',
    config.scripts + '/**/*.js',
    '!' + config.scripts + '/**/*min.js'])
  .pipe(concat('all.min.js'))
  .pipe(gulp.dest(config.scripts));
});

// Concat + uglify all script files required into `all.min.js`
gulp.task('ugly-scripts', function () {
  gulp.src([
    config.vendor + '/angular/angular.js',
    config.vendor + '/angular-resource/angular-resource.js',
    config.vendor + '/hammerjs/hammer.js',
    config.vendor + '/angular-hammer/angular-hammer.js',
    config.scripts + '/**/*.js',
    '!' + config.scripts + '/**/*min.js'])
  .pipe(uglify({
    mangle: true,
    compress: true,
    preserveComments: false
  }))
  .pipe(concat('all.min.js'))
  .pipe(gulp.dest(config.scripts));
});

// Compile Jade template to HTML
gulp.task('templates', function() {
  var locals = {
    stages: require('./json/stages.json')
  };
  gulp.src(config.templates + '/**/*.jade')
    .pipe(jade({ locals: locals }))
    .pipe(gulp.dest('./public'));
});

// Run development level tasks, and watch for changes
gulp.task('default', ['clean', 'styles', 'scripts', 'templates'], function () {
  gulp.watch(config.scripts + '/**/*.js', ['scripts']);
  gulp.watch(config.stylesheets + '/**/*.scss', ['styles']);
  gulp.watch(config.templates + '/**/*.jade', ['templates']);
  gulp.watch('./data/*.json', ['templates']);
});

// Run production tasks including minfication, and without watch
gulp.task('production', ['clean', 'ugly-styles', 'ugly-scripts', 'templates']);
