const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const runSequence = require('run-sequence');

// Development Tasks
// -----------------

// Development Task:
// -- Create Environment

gulp.task('create-src-dirs', shell.task([
  'mkdir src dist'
]));

gulp.task('create-gitignore', shell.task([
  'echo "/node_modules\n/dist\n.gitignore" > .gitignore'
]));

gulp.task('clone-assets', shell.task([
  'git clone git@bitbucket.org:levaigabor/stage-2-dist.git src/assets'
]));

gulp.task('create-html-template', ['clone-assets'], shell.task([
  'cd src/assets && cp template.html ../index.html'
]));

gulp.task('remove-git-repo', ['create-html-template'], shell.task([
  'cd src/assets && rm -rf .git template.html'
]));

gulp.task('create', () => {
  runSequence('create-src-dirs', 'create-gitignore', 'remove-git-repo')
});

// Development Task:
// -- Copy Fonts and Compile SCSS

gulp.task('copy-fonts', () => {
  return gulp.src('src/assets/scss/*.css')
    .pipe(gulp.dest('src/assets/css'))
});

gulp.task('sass', ['copy-fonts'], () => {
  return gulp.src('src/assets/scss/**/*.scss') // Gets all files ending with .scss in app/src/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.')) // Writes the style.css.map
    .pipe(gulp.dest('src/assets/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Development Task:
// -- Start BrowserSync Server

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
});

// Development Task:
// -- Gulp Watcher for Development

gulp.task('watch', () => {
  gulp.watch('src/assets/scss/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', browserSync.reload);
  gulp.watch('src/assets/js/**/*.js', browserSync.reload);
});

// Development Task:
// -- Development Build Sequence

gulp.task('default', function() {
  runSequence(['sass', 'browserSync'], 'watch')
});

// Distribution Tasks
// -----------------

// Distribution Task:
// -- Copy Fonts and Compile SCSS

gulp.task('sass-dist', ['copy-fonts'], () => {
  return gulp.src('src/assets/scss/**/*.scss') // Gets all files ending with .scss in app/src/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest('src/assets/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Distribution Task:
// -- Concatenate and Minify CSS and JS

gulp.task('useref', function(){
  return gulp.src('src/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('src/assets/*.js', uglify()))
    .pipe(gulpIf('src/assets/*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Distribution Task:
// -- Optimizing Images

gulp.task('images', () => {
  return gulp.src('src/assets/images/**/*.+(png|jpg|JPG|jpeg|gif|svg)')
  // Caching images that ran through imagemin
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 9}),
    ], {
      verbose: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
});

// Distribution Task:
// -- Delete previous Distribution builds and Clearing Cache

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

// Clear cached images
gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*']);
});

// Distribution Task:
// -- Distribution Build Sequence

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'cache:clear',
    'sass-dist',
    ['useref', 'images'],
    callback
  )
})