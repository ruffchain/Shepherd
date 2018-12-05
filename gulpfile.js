const gulp = require('gulp')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')

// Added by Yang Jun 2018-11-29
const flatten = require('gulp-flatten')

const tsProject = ts.createProject('tsconfig.json')

gulp.task('clean', () => {
  return gulp
    .src(['dist', 'data', 'build'], { read: false, allowEmpty: true })
    .pipe(clean())
})


gulp.task('compile', function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(flatten())
    .pipe(gulp.dest('dist/blockchain-sdk/ruffchain'))
})

gulp.task(
  'build',
  gulp.series(['clean', 'compile'], () => {
    return gulp
      .src(['programs/node/chain/*.json'])
      .pipe(gulp.dest('./dist/blockchain-sdk/ruffchain'))
  })
)
