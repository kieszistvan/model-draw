var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var path = require('path');
var rimraf = require('gulp-rimraf');
var webpack = require('webpack');
var livereload = require('gulp-livereload');

gulp.task('default', ['build']);

gulp.task('build', function(callback) {
  runSequence('build-web', 'build-server', callback);
});

gulp.task('watch', function(callback) {
  runSequence('watch-server', 'watch-web', callback);
});

gulp.task('watch-server', function(callback) {
  callback();
});

gulp.task('watch-web', function(callback) {
  livereload.listen();

  gulp.watch(['web/**/*'], ['build-web']);
  gulp.watch(['web/**/*'], function(evt) {
    livereload.changed(evt.path);
  });

  callback();
});

gulp.task('build-server', function(callback) {
  callback();
});

gulp.task('build-web', function(callback) {
  runSequence('clean-web', 'compile-web', 'copy-web', callback);
});

gulp.task('clean-web', function(callback) {
  runSequence('clean-dist', callback);
});

gulp.task('compile-web', function(callback) {
  runSequence('compile-webpack', callback);
});

gulp.task('copy-web', function(callback) {
  runSequence('copy-static', callback);
});

gulp.task('clean-dist', function(callback) {
  gulp.src('dist/**/*', {
      read: false
    })
    .pipe(rimraf());
  callback();
});

gulp.task('compile-webpack', function(callback) {
  webpack({
    entry: {
      app: './web/index.js',
      vendor: ['jquery']
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.ProvidePlugin({
        $: 'jquery',
        regeneratorRuntime: 'regenerator/runtime'
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

gulp.task('copy-static', function(callback) {
  gulp.src('web/**/*.html')
    .pipe(gulp.dest('dist/'));
  callback();
});
