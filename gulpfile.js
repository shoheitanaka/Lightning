var gulp = require('gulp');

var cssmin = require('gulp-cssmin');
// ファイルリネーム（.min作成用）
var rename = require('gulp-rename');
// ファイル結合
var concat = require('gulp-concat');
// js最小化
var jsmin = require('gulp-jsmin');
// エラーでも監視を続行させる
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var cmq = require('gulp-merge-media-queries');
// add vender prifix
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');

// http://blog.e-riverstyle.com/2014/02/gulpspritesmithcss-spritegulp.html
// 同期的に処理してくれる
var runSequence = require('run-sequence');


var replace = require('gulp-replace');

gulp.task('text-domain', function () {
		gulp.src(['./inc/font-awesome/*'])
				.pipe(replace('vk_font_awesome_version_textdomain', 'lightning'))
				.pipe(gulp.dest('./inc/font-awesome/'));
		gulp.src(['./inc/vk-mobile-nav/*'])
				.pipe(replace('vk_mobile_nav_textdomain', 'lightning'))
				.pipe(gulp.dest('./inc/vk-mobile-nav/'));
});

gulp.task('sass', function() {
  gulp.src(['design-skin/origin/_scss/**/*.scss'])
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(cmq({
      log: true
    }))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(gulp.dest('./design-skin/origin/css'))
    .pipe(gulp.dest('../lightning-pro/design-skin/origin/css'));
	gulp.src(['./assets/_scss/**/*.scss'])
		.pipe(gulp.dest('../lightning-pro/assets/_scss'))
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(cmq({
      log: true
    }))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(gulp.dest('./assets/css'))
	gulp.src(['./inc/woocommerce/_scss/**.scss'])
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(cmq({
      log: true
    }))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(gulp.dest('./inc/woocommerce/css/'))
});


gulp.task('copy', function() {
  gulp.src('./library/bootstrap/css/bootstrap.min.css')
    .pipe(rename({
      prefix: "_",
      extname: ".scss"
    })) // 拡張子をscssに
    .pipe(gulp.dest('./design-skin/origin/_scss/')); // _scss ディレクトリに保存
  gulp.src('./library/bootstrap/fonts/**')
    .pipe(gulp.dest('./design-skin/origin/fonts/')); // _scss ディレクトリに保存
});


// ファイル結合
gulp.task('js_build', function() {
  return gulp.src([
		'./library/bootstrap/js/bootstrap.min.js',
		'./assets/js/_master.js',
		'./assets/js/_header_fixed.js',
		'./assets/js/_sidebar-fixed.js',
		'./assets/js/_vk-prlx.min.js',
		'./inc/vk-mobile-nav/js/vk-mobile-nav.min.js',
	])
    .pipe(concat('lightning.js'))
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/js/'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('./assets/js/**', ['js_build']);
  gulp.watch('./inc/vk-mobile-nav/js/**', ['js_build']);
  gulp.watch('./design-skin/origin/_scss/**/*.scss', ['sass']);
  gulp.watch('./assets/_scss/**', ['sass']);
  gulp.watch('./inc/woocommerce/_scss/**', ['sass']);
});

gulp.task('default', ['copy', 'js_build', 'text-domain', 'watch']);
gulp.task('compile', ['copy', 'js_build', 'text-domain']);

// copy dist ////////////////////////////////////////////////

gulp.task('copy_dist', function() {
  return gulp.src(
      [
        './**/*.php',
        './**/*.txt',
        './**/*.css',
        './**/*.png',
        './design-skin/**',
        './assets/**',
        './inc/**',
        './languages/**',
        './library/**',
        './template-parts/**',
        "!./tests/**",
        "!./dist/**",
        "!./node_modules/**/*.*"
      ], {
        base: './'
      }
    )
    .pipe(gulp.dest('dist/lightning')); // dist/lightningディレクトリに出力
});
// gulp.task('build:dist',function(){
//     /* ここで、CSS とか JS をコンパイルする */
// });

gulp.task('dist', function(cb) {
  // return runSequence( 'build:dist', 'copy', cb );
  // return runSequence( 'build:dist', 'copy_dist', cb );
  //
  return runSequence('text-domain','copy_dist', cb);
});
