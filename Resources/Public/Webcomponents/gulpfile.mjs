import gulp from 'gulp';
import minify from 'gulp-minify';

gulp.task('compress', function() {
    return gulp.src(['Src/*.js', 'Src/*.mjs'])
        .pipe(minify({
            noSource: false,
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('Dist'))
});

gulp.task('default', gulp.series('compress'));