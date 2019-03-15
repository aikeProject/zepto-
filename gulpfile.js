/**
 * @author 成雨
 * @date 2019/3/15 0015$
 * @Description:
 */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const port = 8080;

gulp.task('zepto', function () {
    return gulp.src('./dist/zepto.js').pipe(gulp.dest('./test'));
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: './test',   // 启动服务的目录 默认 index.html
            index: 'index.html' // 自定义启动文件名
        },
        port: port,
        open: 'external',
        ui: {
            post: port + 1,
        }
    });

    gulp.watch('./test/**/*').on('change', reload);
});

gulp.task('default', gulp.series('zepto', 'server'));
