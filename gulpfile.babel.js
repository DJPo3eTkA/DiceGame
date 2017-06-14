import gulp from 'gulp';
import pug from 'gulp-pug';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import del from 'del';
import remember from 'gulp-remember';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import jslint from 'gulp-jslint';
import minify from 'gulp-csso';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import spritesmith from 'gulp.spritesmith';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import gulpIf from 'gulp-if';
import runSequence from 'run-sequence';
import cache from 'gulp-cache';
import babel from 'gulp-babel';


//* .* - файлы с расширением. * = все файлы

// var onError = function(err) {
//         notify.onError({
//                     title:    "styles",
//                     subtitle: "Failure!",
//                     message:  "Error: <%= error.message %>",
//                     sound:    "false"
//                 })(err);

//         this.emit('end');
//     };
let isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
// NODE_ENV=production gulp 'task
// var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');


gulp.task('clean', ['sourcemap'], () => del.sync('dist/*') // удаление distribution-папки
);
gulp.task('sourcemap', () => del.sync(['src/assets/js/maps', 'src/assets/css/maps'])
 // удаление sourcemaps
);

// Работа c Pug
gulp.task('pug', () => gulp.src('src/pug/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('src/')));

// Работа со стилями
gulp.task('sass', () =>  // Создаем таск Sass
	 gulp.src('src/sass/style.scss') // Берем источник
	  .pipe(newer('assets/css/**/*'))
	  .pipe(plumber())
	  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(minify())
		.pipe(rename({suffix: '.min'})) // Переименование styles.css в styles.min.css
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
		.pipe(gulp.dest('src/assets/css/')) // Выгружаем результата в папку assets/css
);
// Работа со скриптами
gulp.task('scripts', () => gulp.src('src/js/app.js')
	  .pipe(newer('src/assets/js/**/*'))
    .pipe(jslint())
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(babel({
           presets: ['es2015']
        }))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
    .pipe(gulp.dest('src/assets/js')));
// Работа с изображениями
gulp.task('img', () => gulp.src('src/assets/img/**/*')
    .pipe(newer('assets/img/**/*'))
    .pipe(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
	    interlaced: true,
	    progressive: true,
	    svgoPlugins: [{ removeViewBox: false }],
	    use: [pngquant()]
		}))
    .pipe(gulp.dest('src/assets/img')));


		// Browsersync
gulp.task('serve', ['start'], () => { // Создаем таск browser-sync
  browserSync.init({ // Выполняем browserSync
	  server: { // Определяем параметры сервера
	    baseDir: 'src', // Директория для сервера - app
		  index: 'index.html',
  },
		// open: false,
	  notify: false, // Отключаем уведомления
});
	// browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});

// Следим за изменениями
gulp.task('watch', ['serve'], () => {
  gulp.watch('src/sass/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch('src/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
  gulp.watch('src/pug/*.pug', browserSync.reload);
});

gulp.task('start', ['img', 'sass', 'scripts', 'pug']);
gulp.task('build', ['clean'], () => {
  const buildCss = gulp.src( // Переносим библиотеки в продакшен
		'src/assets/css/*.css',
		// 'src/assets/css/libs.min.css'
		)
	.pipe(gulp.dest('dist/assets/css'));

  const buildFonts = gulp.src('src/assets/fonts/**/*.*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/assets/fonts'));

  const buildJs = gulp.src('src/assets/js/**/*.*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/assets/js'));

  const buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

  const buildImg = gulp.src('src/assets/img/**/*.*')
  .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('default', ['watch']);

