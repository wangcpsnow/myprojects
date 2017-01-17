var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    imagemin = require("gulp-imagemin");

gulp.task('html', function() {
    gulp.src(['./src/*.html'])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
    gulp.src(['./src/css/**/*'])
    .pipe(gulp.dest("./dist/css/"))
});

gulp.task('js', function() {
    gulp.src(['./src/js/**/*'])
    .pipe(gulp.dest("./dist/js/"))
});

gulp.task("img", function() {
    gulp.src('./src/images/***/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
})

/*
 * default任务 默认不包括img的压缩(时间有点长)
 * img的单独操作执行任务
 */
 
gulp.task("default",["html","css","js"],function(){
    console.log("OK~OK~OK");
});
