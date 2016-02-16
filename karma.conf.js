
// temp set environment variable for node-webkit
process.env.NODEWEBKIT_BIN = '/Applications/nwjs.app/Contents/MacOS/nwjs';

module.exports = function(config) {
  config.set({

    basePath : './',

    files : [
      'App/bower_components_dist/jquery/dist/jquery.min.js',
      'App/bower_components_dist/bootstrap/dist/js/bootstrap.min.js',
      'App/bower_components_dist/underscore/underscore-min.js',
      'App/bower_components_dist/json3/lib/json3.min.js',
      'App/bower_components_dist/ramda/dist/ramda.min.js',

      'App/bower_components_dist/angular/angular.min.js',
      'App/bower_components_dist/angular-bootstrap/ui-bootstrap.min.js',
      'App/bower_components_dist/angular-sanitize/angular-sanitize.min.js',
      'App/bower_components_dist/angular-animate/angular-animate.min.js',
      'App/bower_components_dist/angular-mocks/angular-mocks.js',
      'App/bower_components_dist/angular-ui-router/release/angular-ui-router.min.js',
      'App/bower_components_dist/ui-router-extras/release/modular/ct-ui-router-extras.core.min.js',
      'App/bower_components_dist/ui-router-extras/release/modular/ct-ui-router-extras.sticky.min.js',

      'App/bower_components_dist/angular-gridster/dist/angular-gridster.min.js',
      'App/bower_components_dist/angular-elastic/elastic.js',
      'App/bower_components_dist/ng-tags-input/ng-tags-input.min.js',
      'App/bower_components_dist/flat-ui/dist/js/flat-ui.min.js',
      'App/bower_components_dist/ngprogress/build/ngProgress.min.js',
      'App/bower_components_dist/ngDialog/js/ngDialog.min.js',
      'App/bower_components_dist/mousetrap/mousetrap.min.js',

      'App/bower_components_dist/fui-angular/fui-template.js',
      'App/bower_components_dist/fui-angular/fui-checkbox.js',
      'App/bower_components_dist/fui-angular/fui-radio.js',
      'App/bower_components_dist/fui-angular/fui-switch.js',
      'App/bower_components_dist/fui-angular/fui-tpls.js',

      'App/scripts/app.js',
      'App/scripts/config/**/*.js',
      'App/scripts/constants/**/*.js',
      'App/scripts/controllers/**/*.js',
      'App/scripts/directives/**/*.js',
      'App/scripts/filters/**/*.js',
      'App/scripts/services/**/*.js',

      'App/scripts/tests/**/*.js'
    ],

    // autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['NodeWebkitWithCustomPath'], // 'NodeWebkit'

    customLaunchers: {
      'NodeWebkitWithCustomPath': {
        base: 'NodeWebkit',
        // Remember to include 'node_modules' if you have some modules there
        paths: ['App/node_modules', 'node_modules']
      }
    },

    singleRun: true,

    reporters: ['mocha', 'coverage'], // 'nyan', 'progress', 'html'

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)

      'App/scripts/config/**/*.js' : ['coverage'],
      'App/scripts/constants/**/*.js' : ['coverage'],
      'App/scripts/controllers/**/*.js' : ['coverage'],
      'App/scripts/directives/**/*.js' : ['coverage'],
      'App/scripts/filters/**/*.js' : ['coverage'],
      'App/scripts/services/**/*.js' : ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcovonly',
      dir : 'coverage',
      subdir: '.',
      file: 'lcov.info'
    },

    // htmlReporter: {
    //   outputFile: 'karma.report.html'
    // }

    // logLevel: 'DEBUG'

  });
};