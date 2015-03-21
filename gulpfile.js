var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    defs = require('gulp-defs'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');

var BUILD_DIR = 'public';

gulp.task('clean', function (cb) {
  del([BUILD_DIR],cb);
});

gulp.task('app-js', function() {

  var b = browserify('./js/app.js');
  b.transform('browserify-defs');

  b.bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('awaken-js', function() {
  var b = browserify({
    entries: ['./js/awaken.js'],
    transform: ['browserify-defs'],
    standalone: 'Awaken',
    debug: true
  });

  b.bundle()
    .pipe(plumber())
    .pipe(source('awaken.js'))
    .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('copy', function () {
  var inputs = [
    'index.html'
  ];
  gulp.src(inputs)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('default', ['awaken-js','app-js','copy']);

gulp.task('watch', ['default'], function(){
  //gulp.watch(['css/*.css'], ['copy']);
  gulp.watch(['index.html'], ['copy']);
  gulp.watch(['js/**/*.js'], ['app-js','awaken-js']);
});
