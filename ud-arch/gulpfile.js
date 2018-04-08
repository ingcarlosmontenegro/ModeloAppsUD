const bower = require('bower');
const capitalize = require('lodash/capitalize');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const del = require('del');
const foreach = require('gulp-foreach');
const fs = require('fs');
const glob = require("glob");
const gulp = require('gulp');
const gutil = require('gulp-util');
const map = require('lodash/map');
const minifyCss = require('gulp-minify-css');
const path = require('path');
const prefixCSS = require('gulp-prefix-css');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sh = require('shelljs');

const paths = {
  clean: ['./www/css/*', './www/js/*', './www/templates/*', './www/assets/*'],
  sass: {
    src: ['./src/scss/ionic.app.scss', './src/scss/style.scss', './modules/**/*.{css,scss}'],
    dest: './www/css/'
  },
  js: {
    src: ['./src/js/**/*.js', './modules/**/*.js'],
    dest: './www/js'
  },
  assets: {
    src: ['./src/assets/**/*', './modules/**/*.{png,jpg,svg}'],
    dest: './www/assets'
  },
  templates: {
    src: ['./src/templates/**/*.html', './modules/**/*.html'],
    dest: './www/templates'
  }
};

gulp.task('default', ['clean', 'assets', 'sass', 'js', 'templates', "watch"]);

gulp.task('clean', function() {
  del(paths.clean);
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass.src)
    .pipe(sass())
    .pipe(foreach(function(stream, file) {
      if(/modules\/?$/.test(file.base)) {
        const moduleName = file.relative.split('/')[0];
        return stream
          .pipe(prefixCSS(`.${moduleName}`));
      } else {
        return stream;
      }
    }))
    .on('error', sass.logError)
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.sass.dest))
    .on('end', done);
});

gulp.task('js', function(done) {
  glob("modules/*", {}, function (er, files) {
    const moduleNames = files.map(dir => dir.replace('modules/', ''));

    gulp.src(paths.js.src)
      .pipe(replace('//<SpaceForModuleNames>', `,
        '${moduleNames.join("','")}'
      `))
      .pipe(replace(
        '//<SpaceForModuleTabConfiguration>',
        moduleNames.map(moduleName => `
          .state('tab.${moduleName}', {
            url: '/${moduleName}',
            views: {
              'tab-${moduleName}': {
                templateUrl: 'templates/${moduleName}/index.html',
                controller: '${capitalize(moduleName)}Ctrl'
              }
            }
          })
        `).join('')
      ))
      .pipe(concat('main.js'))
      .pipe(gulp.dest(paths.js.dest))
      .on('end', done);
  });
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass.src, ['sass']);
  gulp.watch(paths.js.src, ['js']);
});

gulp.task('assets', function() {
  gulp.src(paths.assets.src)
  .pipe(gulp.dest(paths.assets.dest));
});

gulp.task('templates', function(done) {
  glob("modules/*", {}, function (er, files) {
    const modules = files.reduce(function(mods, dir) {
      const moduleName = dir.replace('modules/', '');
      mods[moduleName] = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));
      return mods;
    }, {});

    gulp.src(paths.templates.src)
      .pipe(replace(
        '<!--<SpaceForModuleTabConfiguration>-->',
        map(modules, (module, moduleName) => {
          return `
        <ion-tab title="${module.title}" icon-off="${module.iconOff}" icon-on="${module.iconOn}" href="#/tab/${moduleName}">
        <ion-nav-view name="tab-${moduleName}" class="${moduleName}"></ion-nav-view>
      </ion-tab>
      `}).join('')
    ))
    .pipe(foreach(function(stream, file) {
      if(/modules\/?$/.test(file.base)) {
        const moduleName = file.relative.split('/')[0];
      }
      return stream;
    }))
    .pipe(gulp.dest(paths.templates.dest));
    done();
  })
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
