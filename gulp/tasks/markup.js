var gulp = require('gulp');
var minimist = require("minimist");
var args = minimist(process.argv);
var replace = require("gulp-replace");

if( args.publish ){

  gulp.task( 'markup', function() {

    gulp.src( ['src/htdocs/**','!src/htdocs/*.html'] )
    .pipe(gulp.dest('build'));

    return gulp.src( 'src/htdocs/*.html' )
    .pipe(gulp.dest('build'));

  });

}

else if( !args.online ){

  gulp.task( 'markup', function() {

    gulp.src( ['src/htdocs/**','!src/htdocs/*.html'] )
    .pipe(gulp.dest('build'));

    return gulp.src( 'src/htdocs/*.html' )
    .pipe(replace('<script id="offline">', '<script src="https://localhost:3000/browser-sync/browser-sync-client.2.9.1.js">'))
    .pipe(gulp.dest('build'));

  });


  gulp.task('markup-watch', function() {

    gulp.src( ['src/htdocs/**','!src/htdocs/index.html','!src/htdocs/assets/**', '!src/htdocs/icons/**', '!src/htdocs/images/**', '!src/htdocs/styles/**' ])
    .pipe(gulp.dest('build'));

    return gulp.src( ['src/htdocs/index.html'])
    .pipe(replace('<script id="offline">', '<script src="https://localhost:3000/browser-sync/browser-sync-client.2.9.1.js">'))
    .pipe(gulp.dest('build'));


  });

}
else{

  gulp.task('markup', function() {
    gulp.src( ['src/htdocs/**','!src/htdocs/*.html'] )
    .pipe(gulp.dest('build'));

    return gulp.src( 'src/htdocs/*.html' )
    .pipe(replace('<html manifest="manifest.appcache" lang="en">', '<html lang="en">'))
    .pipe(gulp.dest('build'));
  });

  gulp.task('markup-watch', function() {
    gulp.src( ['src/htdocs/**','!src/htdocs/index.html','!src/htdocs/assets/**', '!src/htdocs/icons/**', '!src/htdocs/images/**', '!src/htdocs/styles/**' ])
    .pipe(gulp.dest('build'));

    return gulp.src( ['src/htdocs/index.html'])
    .pipe(replace('<html manifest="manifest.appcache" lang="en">', '<html lang="en">'))
    .pipe(gulp.dest('build'));
  });


}
