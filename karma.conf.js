
// temp set environment variable for node-webkit
process.env.NODEWEBKIT_BIN = '/Applications//Applications/nwjs.app/Contents/MacOS/nwjs';

module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'App/bower_components_dist/jquery/dist/jquery.js',
      'App/bower_components_dist/angular/angular.js',
      'App/bower_components_dist/bootstrap/dist/js/bootstrap.js',

      'App/bower_components_dist/angular-bootstrap/ui-bootstrap.js',
      'App/bower_components_dist/angular-resource/angular-resource.js',
      'App/bower_components_dist/angular-cookies/angular-cookies.js',
      'App/bower_components_dist/angular-sanitize/angular-sanitize.js',
      'App/bower_components_dist/angular-animate/angular-animate.js',
      'App/bower_components_dist/angular-touch/angular-touch.js',
      'App/bower_components_dist/angular-route/angular-route.js',

      'App/bower_components_dist/angular-mocks/angular-mocks.js',

      'App/bower_components_dist/javascript-detect-element-resize/jquery.resize.js',
      'App/bower_components_dist/angular-gridster/src/angular-gridster.js',
      'App/bower_components_dist/ng-tags-input/ng-tags-input.min.js',
      'App/bower_components_dist/bootstrap-select/dist/js/bootstrap-select.js',
      'App/bower_components_dist/angular-bootstrap-select/build/angular-bootstrap-select.js',
      'App/bower_components_dist/flat-ui/dist/js/flat-ui.js',

      'App/scripts/config/config-node-webkit.js',
      'App/scripts/config/config-app.js',

      'App/scripts/controllers/**/*.js',
      'App/scripts/directives/**/*.js',
      'App/scripts/filters/**/*.js',
      'App/scripts/services/**/*.js',
      'App/scripts/modules/**/*.js',

      'App/scripts/tests/**/*.js'
    ],

    frameworks: ['jasmine'],

    browsers : ['NodeWebkit'],

    singleRun: true,

    reporters: ['progress', 'coverage', 'html'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)

      'App/scripts/app.js' : ['coverage'],
      'App/scripts/config/config-node-webkit.js' : ['coverage'],

      'App/scripts/controllers/**/*.js' : ['coverage'],
      'App/scripts/directives/**/*.js' : ['coverage'],
      'App/scripts/filters/**/*.js' : ['coverage'],
      'App/scripts/services/**/*.js' : ['coverage'],
      'App/scripts/modules/**/*.js' : ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcovonly',
      dir : 'coverage',
      subdir: '.'
    },

    htmlReporter: {
      outputFile: 'karma.report.html'
    }

    // logLevel: 'DEBUG'

  });
};