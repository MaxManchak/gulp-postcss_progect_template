var gulp = require('gulp')
// CSS
var postcss = require('gulp-postcss');   //подключение postcss
var smartImport = require('postcss-smart-import'); //продвинутый импорт css в один файл
var nested = require('postcss-nested'); //позволяет делать вложенности как в cинтаксисе less
var autoprefixer = require('autoprefixer'); //автоматическое добавление префиксов свойствам
var cssnano = require('cssnano'); // продвинутая минификация css
var simpleVars = require('postcss-simple-vars');//использование переменных в css
var mixins = require('postcss-mixins'); //использование примесей
var moveMQ = require('postcss-move-media'); // перемещение и объединение media queries

// HTML & JS
var rigger = require('gulp-rigger'); // импорт в файл
var uglify = require('gulp-uglify'); // минификация js

// IMAGE
var imagemin = require('gulp-imagemin'); // минификация изображений

// webserver
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var path = {
  src: {
    html: 'source/*.html',
    js: 'source/js/script.js',
    jslib:'source/js/library/*.*',
    style: 'source/css/style.css',
    img: 'source/images/*.*',
    fonts: 'source/fonts/**'
  },
  build: {
    html: 'build/',
    js: 'build/js/',
    jslib: 'build/js/',
    style: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/'
  },

  watch: {
    html: 'source/**/*.html',
    js: 'source/js/**/*.js',
    jslib: 'source/js/library/*.js',
    style: 'source/css/**/*.css',
    img: 'source/images/**/*.*',
    fonts: 'source/fonts/**/*.*'
  },
  clean: './build'
};


var config = {
  server: {
    baseDir: "build/"
  },
  tunnel: true,
  host: 'my-progect',
  port: 9000,
  logPrefix: "Frontend_Devil"
};


//                                              CSS
gulp.task('css', function() {
  gulp.src(path.src.style)
    .pipe(postcss([
        smartImport(),
        nested(),
        simpleVars(),
        mixins(),
        moveMQ(),
        autoprefixer({
          browsers: ['last 10 version']
        }),
        cssnano(),
    ]))
    .pipe(gulp.dest(path.build.style))
   .pipe(reload({stream: true}));
});

//                                            HTML
gulp.task('html', function() {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

//                                            JavaScript
gulp.task('js', function() {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('jslib', function() {
  gulp.src(path.src.jslib)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

//                                            Image
gulp.task('image', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.build.img))
  .pipe(reload({stream: true}));
});

//                  fonts
gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
  .pipe(reload({stream: true}));
});




gulp.task('build', ['html', 'js', 'jslib', 'css', 'image', 'fonts']);


gulp.task('webserver', function() {
  browserSync(config);
});

//                                             Watcher
gulp.task('watch', function() {
  gulp.watch([path.watch.html], ['html']);
  gulp.watch([path.watch.style], ['css']);
  gulp.watch([path.watch.js], ['js']);
  gulp.watch([path.watch.jslib], ['jslib']);
  gulp.watch([path.watch.img], ['image']);
  gulp.watch([path.watch.fonts], ['fonts']);
});
//

gulp.task('default', ['build', 'webserver', 'watch']);
