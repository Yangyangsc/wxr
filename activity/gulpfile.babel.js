const gulp = require('gulp')
const server = require('browser-sync').create()
const $ = require('gulp-load-plugins')()
const path = require('path')

gulp.task('server', () => {
  server.init({
    server: {
      baseDir: './'
    }
  })

  gulp.watch('sass/*.scss', ['sass'])

  gulp.watch(['index.html', 'scripts/*.js', 'css/*.css', 'images/*.*', 'pages/*.*']).on('change', server.reload)
})

gulp.task('sass', () => {
  gulp.src('sass/*.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .pipe($.autoprefixer({
        browsers: ['> 1%', 'IE 8'],
        cascade: false
      }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(path.join(__dirname, 'css')))
      .pipe($.rename({
        extname: '.min.css'
      }))
      .pipe($.csso())
      .pipe(gulp.dest(path.join(__dirname, 'css')))
      .pipe(server.stream())
})

gulp.task('usemin', ()=>{
  gulp.src('./index.html')
    .pipe($.useref())
    .pipe(gulp.dest('build/'))
})

gulp.task('clean', () => {
  gulp.src('./build/*')
    .pipe($.clean());
})

gulp.task('imagemin', () => {
  gulp.src('./images/*.*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./build/images'))
})

// gulp.task('move', ['clean'], () => {
//   gulp.src('./sound/*.*')
//     .pipe(gulp.dest('./build/sound/'))
// })

gulp.task('buildServer', ['usemin', 'imagemin'], () => {
  server.init({
    port: 3030,
    server: {
      baseDir: './build'
    }
  })
})

gulp.task('default', ['server'])

gulp.task('build', ['buildServer'])