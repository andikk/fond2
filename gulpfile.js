"use strict";

var gulp = require("gulp");
var saas = require("gulp-sass")(require("sass"));
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
const fileinclude = require("gulp-file-include");

gulp.task("css-main", function () {
  return gulp
    .src("source/scss/main.scss")
    .pipe(plumber())
    .pipe(saas())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("css-other", function () {
  return gulp
    .src("source/scss/other.scss")
    .pipe(plumber())
    .pipe(saas())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("fileinclude", function (done) {
  return gulp
    .src("source/pages/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("source"));
  done();
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/scss/**/*.scss", gulp.series("css-main"));
  gulp.watch("source/scss/**/*.scss", gulp.series("css-other"));
  gulp.watch("source/js/bundle/*.js", gulp.series("js"));
  gulp.watch("source/pages/**/*.html", gulp.series("fileinclude"));
  gulp.watch("source/*.html").on("change", server.reload);
  gulp.watch("source/js/*/*.js").on("change", server.reload);
});

gulp.task("clean", function (done) {
  return del("build");
  done();
});

gulp.task("style-main", function (done) {
  gulp
    .src("source/scss/main.scss")
    .pipe(plumber())
    .pipe(saas())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  done();
});

gulp.task("style-other", function (done) {
  gulp
    .src("source/scss/other.scss")
    .pipe(plumber())
    .pipe(saas())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("other.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  done();
});

gulp.task("images", function (done) {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("source/img"));
  done();
});

gulp.task("copy", function (done) {
  return gulp
    .src(
      [
        "source/fonts/**/*.*",
        "source/img/**",
        "source/*.html",
        "source/js/bundle.js",
        "source/js/single/*.js",
        "source/css/*.*",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
});

gulp.task("js", function () {
  return gulp
    .src(["source/js/bundle/custom.js"])
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(gulp.dest("source/js"));
  done();
});

gulp.task("del-vendor-folder", function (done) {
  return del("build/js/bundle");
  done();
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    "style-main",
    "style-other",
    "images",
    "copy",
    "del-vendor-folder",
    "js",
    function (done) {
      done();
    }
  )
);

gulp.task(
  "start",
  gulp.series("fileinclude", "css-main", "css-other", "copy", "js", "server")
);
