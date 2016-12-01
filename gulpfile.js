var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy:true});
var browserSync = require('browser-sync').create();

$.browserSync = browserSync;

require('gulp-task-loader')({
	EXPRESS_PORT : 4000,
    EXPRESS_ROOT : __dirname,
    LIVERELOAD_PORT : 35729,
	$: $
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

gulp.task('default', ['browserSync', 'css', 'image', 'font', 'js', 'watch']);
