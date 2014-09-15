
// temp set environment variable for node-webkit
process.env.NODEWEBKIT_BIN = '/Applications/node-webkit.app/Contents/MacOS/node-webkit';

module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'App/bower_components/jquery/dist/jquery.js',
      'App/bower_components/angular/angular.js',
      'App/bower_components/bootstrap/dist/js/bootstrap.js',

      'App/bower_components/angular-bootstrap/ui-bootstrap.js',
      'App/bower_components/angular-animate/angular-animate.js',
      'App/bower_components/angular-cookies/angular-cookies.js',
      'App/bower_components/angular-resource/angular-resource.js',
      'App/bower_components/angular-route/angular-route.js',
      'App/bower_components/angular-sanitize/angular-sanitize.js',
      'App/bower_components/angular-touch/angular-touch.js',
      'App/bower_components/angular-mocks/angular-mocks.js',

      'App/bower_components/ng-tags-input/ng-tags-input.min.js',
      'App/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
      'App/bower_components/angular-bootstrap-select/build/angular-bootstrap-select.js',
      'App/bower_components/flat-ui/dist/js/flat-ui.js',

      'App/scripts/node-webkit-config.js',
      'App/scripts/app.js',

      'App/scripts/controllers/**/*.js',
      'App/scripts/directives/**/*.js',
      'App/scripts/filters/**/*.js',
      'App/scripts/services/**/*.js',

      'App/scripts/tests/**/*.js'
    ],

    frameworks: ['jasmine'],

    browsers : ['NodeWebkit'],

    singleRun: true,

    // plugins with 'karma' prefix loaded by default!
    // see: http://karma-runner.github.io/0.12/config/plugins.html

    // plugins : [
    //   'karma-jasmine',
    //   'karma-htmlfile-reporter'
    // ]

    reporters: ['html'], //'progress', 

    htmlReporter: {
      outputFile: 'karma.report.html'
    }

    // customLaunchers: {
    //   'NodeWebkit': {
    //     base: 'NodeWebkit',
    //     options: {
    //       window: {
    //         // 'main': 'index.html'
    //       }
    //     }
    //   }
    // }

  });
};