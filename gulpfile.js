var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const runSequence = require('gulp4-run-sequence');
var clean = require('gulp-clean');
var dist = "dist";

gulp.task("default", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(dist));
});

gulp.task('clean', function() {
    return gulp.src(dist, { read: false })
        .pipe(clean({ force: true }));
});

gulp.task("bundle", function() {
    return gulp.src(['api/swagger/**/*', 'config/**/*'], {
        base: "./"
    }).pipe(gulp.dest(dist));
});

gulp.task("compile", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(dist));
});

gulp.task('build', gulp.series('clean', 'compile', 'bundle'));