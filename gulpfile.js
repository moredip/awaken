var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    del = require('del'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    babelify = require('babelify');

var BUILD_DIR = 'public';

gulp.task('clean', function (cb) {
  del([BUILD_DIR],cb);
});

gulp.task('app-js', function() {

  var b = browserify('./js/app.js');
  b.transform(babelify);

  b.bundle()
    .pipe(plugins.plumber())
    .pipe(source('app.js'))
    .pipe(gulp.dest(BUILD_DIR))
    //.on('error', gutil.log);
});

gulp.task('awaken-js', function() {
  var b = browserify({
    entries: ['./js/awaken.js'],
    transform: [babelify],
    standalone: 'Awaken',
    debug: true
  });

  b.bundle()
    .pipe(plugins.plumber())
    .pipe(source('awaken.js'))
    .pipe(gulp.dest(BUILD_DIR));
    //.on('error', gutil.log);
});

gulp.task('tests', function() {
  return gulp.src(['tests/**/*_test.js'], { read: false })
    .pipe(plugins.mocha({
      reporter: 'spec',
      useColors: false,
      debug: true
    }));
});


gulp.task('copy', function () {
  var inputs = [
    'index.html'
  ];
  gulp.src(inputs)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('default', ['tests','awaken-js','app-js','copy']);

gulp.task('watch', ['default'], function(){
  //gulp.watch(['css/*.css'], ['copy']);
  gulp.watch(['index.html'], ['copy']);
  gulp.watch(['js/**/*.js'], ['app-js','awaken-js']);
  gulp.watch(['js/**/*.js','tests/**/*.js'], ['tests']);
});
