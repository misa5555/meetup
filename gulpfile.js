var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
require('es6-promise').polyfill();

gulp.task('default', ['styles', 'js', 'css'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('dist/js/*.js', ['js']);
	// gulp.watch('js/**/*.js', ['lint']);

	browserSync.init({
		server: './'
	});
});


var paths = {
  'select2': './node_modules/select2/dist/js/',
  'bootstrap': './node_modules/bootstrap/dist/js/',
  'datetimepicker': './bower_components/eonasdan-bootstrap-datetimepicker/build/js/',
  'moment': './bower_components/moment/min/'
}
gulp.task('js', function(){
  gulp.src([
    paths.select2 + 'select2.min.js',
    paths.bootstrap + 'bootstrap.min.js',
    paths.moment + 'moment.min.js',
    paths.datetimepicker + 'bootstrap-datetimepicker.min.js',
  ])
  .pipe(concat("libs.js"))
  .pipe(gulp.dest('dist/js'));
});


gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());
});

var pathsCss = {
  'select2' : './node_modules/select2/dist/css/',
  'datetimepicker': './bower_components/eonasdan-bootstrap-datetimepicker/build/css/',
  'bootstrap': './css/'

}
gulp.task('css', function() {
  gulp.src([
    pathsCss.select2 + 'select2.min.css',
    pathsCss.datetimepicker + 'bootstrap-datetimepicker.min.css',
    pathsCss.bootstrap + 'bootstrap.min.css'
  ])
  .pipe(concatCss("libs.css"))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('lint', function () {
	return gulp.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});

gulp.task('tests', function () {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}));
});
