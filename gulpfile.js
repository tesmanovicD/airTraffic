const gulp = require("gulp");
const uglify = require('gulp-uglify-es').default;
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");


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

// Optimize image size
gulp.task("imagemin", function() {
  gulp.src("src/img/*")
      .pipe(imagemin())
      .pipe(gulp.dest("dist/img"))
});

//Compile sass and autoprefix if needed
gulp.task("sass", function() {
  gulp.src("src/scss/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gulp.dest("dist/css"))
})

gulp.task("default", ["minifyJS", "sass", "copyHTML", "imagemin"]);

gulp.task("watch", function() {
  gulp.watch("src/js/*.js", ["minifyJS"]);
  gulp.watch("src/img/*.js", ["imagemin"]);
  gulp.watch("src/scss/*.scss", ["sass"]);
  gulp.watch("src/*.html", ["copyHTML"])
})
