var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const runSequence = require('gulp4-run-sequence');
var dist = "dist";
var src = "./"

gulp.task("default", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(dist));
});


gulp.task("bundle", function() {
    return gulp.src(['api/swagger/**/*', 'config/**/*'], {
        base: src
    }).pipe(gulp.dest(dist));
});

gulp.task("compile", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(dist));
});

gulp.task('build', gulp.series('compile', 'bundle'));