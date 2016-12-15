var browserSync = require('browser-sync');
var gulp        = require('gulp');
var minimist = require("minimist");
var args = minimist(process.argv);
var replace = require("gulp-replace");

gulp.task('browserSync', ['build'], function() {
  browserSync({
    port: args.online ? 4000 : 3000,
    server: {
      // src is included for use with sass source maps
      baseDir: ['build', 'src']
    },
    notify: false,
    files: [
      // Watch everything in build
      "build/**",
      "!build/images/map/**"
    ]
  });
});
