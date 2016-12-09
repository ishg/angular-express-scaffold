'use strict';

var gulp  = require('gulp');

// Toolkit
var clean = require('gulp-clean');
var filter = require('gulp-filter');
var print = require('gulp-print');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

// Technologies
var babel = require('gulp-babel');
var sass  = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

// Non gulp-* 
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');

///////////////////////////////////////////////////////////////
// WORKFLOW
///////////////////////////////////////////////////////////////

gulp.task('default', function() {
  // Default task run when just 'gulp' is called  
});

gulp.task('serve', ['dist', 'browser-sync', 'watch']);

gulp.task('dist', ['clean', 'copyDir', 'bowercss', 'bowerjs', 'sass', 'js'])

gulp.task('watch', ['bower:watch', 'sass:watch', 'js:watch', 'html:watch'])

gulp.task('clean', function(done) {
  gulp.src('./dist', {read: false})
    .pipe(clean({ force: true }))
    .on('end', done);
})

gulp.task('copyDir', function(done) {
  gulp.src([
    './src/**/*', 
    '!src/public/scripts/**', 
    '!src/public/styles/**'])
    .pipe(gulp.dest('./dist/'))
    .on('end', done);
})

gulp.task('build', function() {
  // Build for production
})

gulp.task('test', function() {
  gulp.src('test')
    .pipe(mocha())
    .once('error', function() {
      process.exit(1)
    })
    .once('end', function() {
      process.exit()
    })
})

///////////////////////////////////////////////////////////////
// TOOLS
///////////////////////////////////////////////////////////////

gulp.task('nodemon', function(done) {
  var started = false;
  nodemon({
    script: './dist/app.js',
    env: { 'NODE_ENV': 'development' }
  }).on('start', function() {
    if (!started) {
      done();
      started = true;
    }
  })
})

gulp.task('browser-sync', ['nodemon'], function(done) {
  browserSync.init(null, {
    proxy: 'http://localhost:9000',
    files: ['src/**/*.*'],
    browser: 'google chrome',
    port: 7000,
  });
})

gulp.task('lint', function() {
  gulp.src('src/public/scripts/app/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function(err){
      gutil.log(err.name + ': ' + err.message)
    })
})

///////////////////////////////////////////////////////////////
// BOWER
///////////////////////////////////////////////////////////////

gulp.task('bowercss', function(done) {
  gulp.src(mainBowerFiles())
    .pipe(filter('**/*.css'))
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('./dist/public/styles/'))
    .on('end', done);
});

gulp.task('bowerjs', function(done) {
  var vendorFiles = ['./src/public/scripts/vendor/*.js']
  gulp.src(mainBowerFiles().concat(vendorFiles))
    .pipe(filter('**/*.js'))
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/public/scripts'))
    .on('end', done);
});

gulp.task('bower:watch', function () {
  gulp.watch('bower_components/**', ['bowerjs', 'bowercss']);
})

///////////////////////////////////////////////////////////////
// SASS
///////////////////////////////////////////////////////////////

gulp.task('sass', function(done) {
  gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'))
    .on('end', done);
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
});

///////////////////////////////////////////////////////////////
// JS - ES6
///////////////////////////////////////////////////////////////

gulp.task('js', function(done) {
  gulp.src('./src/public/scripts/app/**/*.js')
    .pipe(babel({ presets: ['es2015'] }))   
    .pipe(gulp.dest('dist/public/scripts/'))
    .on('end', done);
});

gulp.task('js:watch', function () {
  gulp.watch('./src/public/scripts/app/**/*.js', ['js']);
});

///////////////////////////////////////////////////////////////
// HTML
///////////////////////////////////////////////////////////////

gulp.task('html', function(done) {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('dist/'))
    .on('end', done);
});

gulp.task('html:watch', function () {
  gulp.watch('./src/**/*.html', ['html']);
});

