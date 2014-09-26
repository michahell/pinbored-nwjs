
module.exports = function(grunt) {

  // requirements
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    bowercopy: {
      options: {
        // Task-specific options go here
        srcPrefix : 'App/bower_components',
        destPrefix : 'App/bower_components_dist',
        runBower : false,
        clean : false,
        report : true
      },
      bowercomponents: {
        // Target-specific file lists and/or options go here
        files: {
          // Keys are destinations (prefixed with `options.destPrefix`)
          // Values are sources (prefixed with `options.srcPrefix`); One source per destination
          // e.g. 'bower_components/chai/lib/chai.js' will be copied to 'bower_components_dist/libs/chai.js'
          // 'libs/chai.js': 'chai/lib/chai.js'

          // CSS
          'bootstrap/dist/css/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
          'animate.css/animate.min.css': 'animate.css/animate.min.css',
          'ng-tags-input/ng-tags-input.min.css': 'ng-tags-input/ng-tags-input.min.css',
          'bootstrap-select/dist/css/bootstrap-select.css': 'bootstrap-select/dist/css/bootstrap-select.css',
          'flat-ui/dist/css/flat-ui.css': 'flat-ui/dist/css/flat-ui.css',
          'stroll/css/stroll.min.css': 'stroll/css/stroll.min.css',

          // JS
          'jquery/dist/jquery.js': 'jquery/dist/jquery.js',
          'angular/angular.js': 'angular/angular.js',
          'bootstrap/dist/js/bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
          'json3/lib/json3.min.js': 'json3/lib/json3.min.js',

          'angular-bootstrap/ui-bootstrap.js': 'angular-bootstrap/ui-bootstrap.js',
          'angular-resource/angular-resource.js': 'angular-resource/angular-resource.js',
          'angular-cookies/angular-cookies.js': 'angular-cookies/angular-cookies.js',
          'angular-route/angular-route.js': 'angular-route/angular-route.js',
          'angular-sanitize/angular-sanitize.js': 'angular-sanitize/angular-sanitize.js',
          'angular-touch/angular-touch.js': 'angular-touch/angular-touch.js',
          'angular-animate/angular-animate.js': 'angular-animate/angular-animate.js',
          'angular-mocks/angular-mocks.js': 'angular-mocks/angular-mocks.js',

          'ng-tags-input/ng-tags-input.min.js': 'ng-tags-input/ng-tags-input.min.js',
          'bootstrap-select/dist/js/bootstrap-select.js': 'bootstrap-select/dist/js/bootstrap-select.js',
          'angular-bootstrap-select/build/angular-bootstrap-select.js': 'angular-bootstrap-select/build/angular-bootstrap-select.js',
          'flat-ui/dist/js/flat-ui.js': 'flat-ui/dist/js/flat-ui.js',
          'stroll/js/stroll.min.js': 'stroll/js/stroll.min.js'
        }
      }
    },

    nodewebkit: {
      
      buildOsx : {
        options: {
          platforms: ['osx'],
          buildType: 'versioned', // [appName] -v[appVersion]
          macCredits: './Resources/pinbored-credits.html',
          macIcns: './Resources/pinbored-icon.icns',
          // macZip: 'false',
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App/**/*'] // Your node-webkit app
      },

      buildWin : {
        options: {
          platforms: ['win'],
          buildType: 'versioned', // [appName] -v[appVersion]
          // winIco: 'null',
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App/**/*'] // Your node-webkit app
      },

      buildLin32 : {
        options: {
          platforms: ['linux32'],
          buildType: 'versioned', // [appName] -v[appVersion]
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App/**/*'] // Your node-webkit app
      },

      buildLin64 : {
        options: {
          platforms: ['linux64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App/**/*'] // Your node-webkit app
      }

    },

    karma : {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    open : {
      report : {
        path : 'karma.report.html',
        app: 'Google Chrome'
      }
    },

    shell: {
      multiple: {
        command: [
          'export CODECLIMATE_REPO_TOKEN=10daff674413d0c7f0a4a4c177db01e8215217c74c23ec408dc4325e7ece27ca',
          'codeclimate < coverage/lcov.info'
        ].join('&&')
      }
    }
    
  });

  // Load the plugin that provides the "nodewebkit" task.
  grunt.loadNpmTasks('grunt-npmcopy');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');

  // testing task(s)
  // grunt.registerTask('test', ['karma', 'open:report']);
  grunt.registerTask('test', 'runs testing, shows report, generates coverage', function () {
    var tasks = ['karma', 'open:report', 'shell'];
    // Use the force option for all tasks declared in the previous line
    grunt.option('force', true);
    grunt.task.run(tasks);
  });

  // building task(s)
  grunt.registerTask('build', ['nodewebkit:buildOsx', 'nodewebkit:buildWin', 'nodewebkit:buildLin32', 'nodewebkit:buildLin64']);

  grunt.registerTask('osx', ['nodewebkit:buildOsx']);
  grunt.registerTask('win', ['nodewebkit:buildWin']);
  grunt.registerTask('lin32', ['nodewebkit:buildLin32']);
  grunt.registerTask('lin64', ['nodewebkit:buildLin64']);

  // Default task(s)
  // grunt.registerTask('default', ['karma', 'open:report', 'nodewebkit:buildOsx', 'nodewebkit:buildWin', 'nodewebkit:buildLin32', 'nodewebkit:buildLin64']);

  grunt.registerTask('default', ['test', 'osx']);

};