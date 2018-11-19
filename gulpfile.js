const gulp = require('gulp');
const shell = require('gulp-shell');
const clean = require('gulp-clean');
gulp.task('clean', () => {
    return gulp.src(['dist', 'data'], {read:false, allowEmpty:true})
        .pipe(clean());
});

gulp.task('build-common', shell.task('cd common;npm install;npm run build'));
gulp.task('build', gulp.series(['clean', 'build-common'], function() {
    return gulp.src('common/dist/blockchain-sdk')
            .pipe(gulp.symlink('dist'))
}));

