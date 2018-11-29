const gulp = require('gulp')
const shell = require('gulp-shell')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const rename = require('gulp-rename');
const flatten = require('gulp-flatten')
const tsProject = ts.createProject('tsconfig.json')

gulp.task('clean', () => {
    return gulp
        .src(['dist', 'data', 'build'], {
            read: false,
            allowEmpty: true
        })
        .pipe(clean())
})

gulp.task('build-common', gulp.series(shell.task('cd common;npm run build')));

gulp.task('install-ruffvm-index', () => {
    return gulp.src(['ruffvm/index.js'])
        .pipe(gulp.dest('./dist/blockchain-sdk/ruffchain/ruffvm'));
});

gulp.task('install-ruffvm-bindings', () => {
    return gulp.src(['ruffvm/build/Release/**']).pipe(gulp.dest('./build'));
});

gulp.task('install-ruffvm', gulp.series([shell.task('cd ruffvm;npm install'),
    'install-ruffvm-index',
    'install-ruffvm-bindings'
]));

gulp.task('compile', function () {
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(flatten())
        .pipe(gulp.dest('dist/blockchain-sdk/ruffchain'))
})
gulp.task('update-wallet', () => {
    return gulp.src(['./dist/blockchain-sdk/ruffchain/wallet/chain/wallet.js'])
        .pipe(gulp.dest('./common/dist/blockchain-sdk/demo/dpos/wallet'));
})
gulp.task('update-handler', () => {
    return gulp.src(['./dist/blockchain-sdk/ruffchain/node/chain/handler.js'])
        .pipe(gulp.dest('./common/dist/blockchain-sdk/demo/dpos/chain'));
})

gulp.task('build', gulp.series(['clean', 'build-common', 'install-ruffvm', 'compile'], () => {
    return gulp.src(['programs/node/chain/*.json'])
        .pipe(gulp.dest('./dist/blockchain-sdk/ruffchain'));
}));
