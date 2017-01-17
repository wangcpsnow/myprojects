var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    imagemin = require("gulp-imagemin"),
    connect = require('gulp-connect');

gulp.task('html', function() {
    gulp.src(['./src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src(['./src/css/**/*'])
        .pipe(gulp.dest("./dist/css/"))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(['./src/js/**/*'])
        .pipe(gulp.dest("./dist/js/"))
        .pipe(connect.reload());
});

gulp.task("img", function() {
    gulp.src('./src/images/***/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
        .pipe(connect.reload());
})

gulp.task('connect', function() {
    connect.server({
        root: './dist',
        livereload: true,
        port: 8000
    });
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.html'], ['html']);
    gulp.watch(['./src/**/*.html'], ['html']);

    gulp.watch(['./src/js/*.js'], ['js']);
    gulp.watch(['./src/css/**/*'], ['css']);
    gulp.watch(['./src/images/***/**/*'], ['img']);
});

/*
 * default任务 默认不包括img的压缩(时间有点长)
 * img的单独操作执行任务
 */
 
gulp.task("default",["html","css","js"],function(){
    console.log("OK~OK~OK");
});

gulp.task("code",["connect",'watch']);
