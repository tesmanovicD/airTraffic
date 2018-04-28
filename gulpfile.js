const gulp = require("gulp");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");



//Copy html files
gulp.task("copyHTML", function() {
  gulp.src("src/*.html")
      .pipe(gulp.dest("dist"))
})

//Minify js
gulp.task("minifyJS", function() {
  gulp.src("src/js/*.js")
      .pipe(uglify())
      .pipe(gulp.dest("dist/js"))
})

//Compile sass and autoprefix if needed
gulp.task("sass", function() {
  gulp.src("src/sass/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gulp.dest("dist/css"))
})

gulp.task("default", ["minifyJS", "sass", "copyHTML"]);

gulp.task("watch", function() {
  gulp.watch("src/js/*.js", ["minifyJS"]);
  gulp.watch("src/scss/*.scss", ["sass"]);
  gulp.watch("src/*.html", ["copyHTML"])
})
