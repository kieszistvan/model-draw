var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var path = require('path');
var del = require('del');
var webpack = require('webpack');
var livereload = require('gulp-livereload');
var babel = require('gulp-babel');

gulp.task('default', ['build']);

gulp.task('build', function(callback) {
  runSequence(['build-web', 'build-server'], callback);
});

gulp.task('watch', function(callback) {
  runSequence('watch-server', 'watch-web', callback);
});

gulp.task('watch-web', function(callback) {
  livereload.listen();

  gulp.watch(['web/**/*'], ['build-web']);
  gulp.watch(['web/**/*'], function(evt) {
    livereload.changed(evt.path);
  });

  callback();
});

gulp.task('build-web', function(callback) {
  runSequence('clean-web', 'compile-web', 'copy-web', callback);
});

gulp.task('clean-web', function(callback) {
  del('dist/web', callback);
});

gulp.task('compile-web', function(callback) {
  runSequence('compile-webpack', callback);
});

gulp.task('copy-web', function(callback) {
  gulp.src('web/**/*.html')
    .pipe(gulp.dest('dist/web'));
  callback();
});

gulp.task('compile-webpack', function(callback) {
  webpack({
    entry: {
      app: './web/index.js',
      vendor: ['jquery', 'raphael/dev', 'radio', 'shortid']
    },
    output: {
      path: path.join(__dirname, 'dist/web/lib'),
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
      //      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.ProvidePlugin({
        regeneratorRuntime: 'regenerator/runtime',
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: 'bundle.map.js'
      })
    ],
    module: {
      loaders: [{
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }]
    }
  }, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({}));

    callback();
  });
});

gulp.task('watch-server', function(callback) {
  gulp.watch(['server/**/*'], ['build-server']);
  callback();
});

gulp.task('build-server', function(callback) {
  runSequence('clean-server', 'compile-server', callback);
});

gulp.task('clean-server', function(callback) {
  del('dist/server', callback);
});

gulp.task('compile-server', function(callback) {
  return gulp.src('server/index.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/server'));
});
