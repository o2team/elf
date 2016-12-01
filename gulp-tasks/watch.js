module.exports = function(){
    var $ = this.opts.$;

    this.gulp.watch('css/**/*.css', ['css']);
    this.gulp.watch('js/*.js', ['js']);

    this.gulp.watch('*.html', $.browserSync.reload);
    this.gulp.watch('js/**/*.js', $.browserSync.reload);

};
