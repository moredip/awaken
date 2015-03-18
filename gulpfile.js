var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    defs = require('gulp-defs'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');

var BUILD_DIR = 'public';

gulp.task('clean', function (cb) {
  del([BUILD_DIR],cb);
});

//gulp.task('build-coffee', function () {
  //var bundler = browserify({
      //entries: ['./app.js'],
      //basedir: './js',
      //extensions: ['.jsx'],
      //debug: true
    //});

    //var coffeeFiles = gulp.src('coffee/**/*.coffee')
      //.pipe(plumber())
      //.pipe(coffee())
      //.pipe(concat('app.js'))
      //.pipe(gulp.dest(BUILD_DIR));
//});

gulp.task('app-js', function() {
  //var b = browserify({
      //entries: ['./coffee/app.coffee'],
      //transform: ['coffeeify'],
      //extensions: ['.coffee']
    //});
    
  var b = browserify('./js/app.js');
  b.transform('browserify-defs');

  b.bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('copy', function () {
  var inputs = [
    'index.html'
  ];
  gulp.src(inputs)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('default', ['app-js','copy']);

gulp.task('watch', ['default'], function(){
  //gulp.watch(['css/*.css'], ['copy']);
  gulp.watch(['index.html'], ['copy']);
  //gulp.watch(['coffee/**/*.coffee'], ['build-coffee']);
  gulp.watch(['js/**/*.js'], ['app-js']);
});
