import gulp from 'gulp';
import typescript from 'ttypescript';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import path from 'path';
import concat from 'gulp-concat';

gulp.task('clean', () => {
    return new Promise((resolve, reject) => {
        rimraf(path.join(process.cwd(), 'build'), e => (e ? reject(e) : resolve()));
    });
});

gulp.task('build', () => {
    const tsc = ts.createProject('tsconfig.json', {
        typescript
    });

    return gulp
        .src('src/**/*.ts')
        .pipe(tsc())
        .pipe(uglify({ mangle: { toplevel: true } }))
        .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series('clean', 'build'));
