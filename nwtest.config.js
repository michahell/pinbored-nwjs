{
    "files": [
      'App/bower_components_dist/jquery/dist/jquery.js',
      'App/bower_components_dist/angular/angular.js',
      'App/bower_components_dist/bootstrap/dist/js/bootstrap.js',
      'App/bower_components_dist/underscore/underscore.js',

      'App/bower_components_dist/angular-bootstrap/ui-bootstrap.js',
      'App/bower_components_dist/angular-resource/angular-resource.js',
      'App/bower_components_dist/angular-sanitize/angular-sanitize.js',
      'App/bower_components_dist/angular-animate/angular-animate.js',
      'App/bower_components_dist/angular-route/angular-route.js',
      'App/bower_components_dist/angular-mocks/angular-mocks.js',
      'App/bower_components_dist/angular-gridster/src/angular-gridster.js',
      'App/bower_components_dist/ng-tags-input/ng-tags-input.js',
      'App/bower_components_dist/flat-ui/dist/js/flat-ui.js',
      'App/bower_components_dist/fui-angular/fui-tpls.js',

      'App/scripts/config/config-node-webkit.js',
      'App/scripts/config/config-app.js',
      
      'App/scripts/app.js',

      'App/scripts/controllers/**/*.js',
      'App/scripts/directives/**/*.js',
      'App/scripts/filters/**/*.js',
      'App/scripts/modules/**/*.js',
      'App/scripts/services/**/*.js'
    ],

    "src": "App/scripts/**/*.js",
    "mock":"App/scripts/tests/**/*mock.js",
    "deps":"App/scripts/tests/**/*deps.js",
    "test":"App/scripts/tests/**/*.js",
    "output": "test-results",
    "nwpath": "/Applications/nwjs.app/Contents/MacOS/nwjs",
    "ext": "test",
    "covReport": ['cobertura', 'lcov', 'html' ],
    "doNotRunCoverage": false
}