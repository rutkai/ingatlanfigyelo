const gulp = require('gulp');
const deleteLines = require('gulp-delete-lines');

gulp.task('default', function() {
    gulp
        .src(['src/frontend/src/**/*'])
        .pipe(deleteLines({
            'filters': [
                /^\W*styleUrls: \['[^']+'],?$/im
            ]
        }))
        .pipe(gulp.dest('src/frontend/dist'));
});
