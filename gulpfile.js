const gulp = require('gulp')
const shell = require('gulp-shell')
const clean = require('gulp-clean')

const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const tsProject = ts.createProject('tsconfig.json')

gulp.task('clean', () => {
  return gulp
    .src(['dist', 'data'], { read: false, allowEmpty: true })
    .pipe(clean())
})

gulp.task('build-common', gulp.series(shell.task('cd common;npm run build'), () => {
    return gulp.src('common/dist/blockchain-sdk')
        .pipe(gulp.symlink('dist'))
}));

gulp.task('compile', function() {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/blockchain-sdk/ruffchain'))
})

gulp.task('build', gulp.series(['clean', 'build-common', 'compile'], () => {
    return gulp.src(["programs/node/chain/*.json"])
        .pipe(gulp.dest("./dist/blockchain-sdk/ruffchain"));
}));
