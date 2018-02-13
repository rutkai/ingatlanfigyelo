const gulp = require('gulp');
const deleteLines = require('gulp-delete-lines');
const replace = require('gulp-replace');

gulp.task('default', function() {
    // Components
    gulp
        .src(['frontend/src/app/**/*'])
        .pipe(deleteLines({
            'filters': [
                /^\W*styleUrls: \['[^']+'],?$/im
            ]
        }))
        .pipe(gulp.dest('src/frontend/app'));

    // Non components
    gulp
        .src(['frontend/src/scss/**/*'])
        .pipe(replace('@import "~', '@import "'))
        .pipe(gulp.dest('src/frontend/scss'));
    gulp
        .src(['frontend/src/environments/**/*'])
        .pipe(replace("apiScheme: 'http'", "apiScheme: 'https'"))
        .pipe(replace("apiDomain: 'localhost:3000'", "apiDomain: 'api.ingatlanfigyelo.eu'"))
        .pipe(gulp.dest('src/frontend/environments'));
    gulp
        .src(['frontend/src/styles.scss'])
        .pipe(replace('@import "~', '@import "'))
        .pipe(gulp.dest('src/frontend'));

    // Assets
    gulp
        .src(['frontend/src/assets/**/*'])
        .pipe(gulp.dest('src/assets'));
});
