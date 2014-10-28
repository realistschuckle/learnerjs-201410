var gulp, sass, web;

gulp = require('gulp');
sass = require('gulp-sass');
web = require('gulp-webserver');

gulp.task('default', [ 'web' ]);

gulp.task('dev', [ 'web', 'watch' ]);

gulp.task('sass', function () {
  return gulp.src('css/theme/source/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css/theme'));
});

gulp.task('watch', [ 'sass' ], function () {
  gulp.watch('css/theme/source/*.scss', [ 'sass' ]);
});

gulp.task('web', function () {
  return gulp.src('.')
    .pipe(web());
});
