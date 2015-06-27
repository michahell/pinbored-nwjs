
module.exports = function(grunt) {

  // requirements
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
      bowercopy: { src: 'App/bower_components_dist' },
      build: { src: 'Build' },
      release: { src: 'App_release' }
    },

    // copy only neccesary files from bower modules
    bowercopy: {
      options: {
        // Task-specific options go here
        srcPrefix : 'App/bower_components',
        destPrefix : 'App/bower_components_dist',
        runBower : true,
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

          // FONTS
          'flat-ui/dist/fonts/': 'flat-ui/dist/fonts/',
          'bootstrap/dist/fonts/': 'bootstrap/dist/fonts/',

          // CSS
          'bootstrap/dist/css/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
          'animate.css/animate.min.css': 'animate.css/animate.min.css',
          'ng-tags-input/ng-tags-input.min.css': 'ng-tags-input/ng-tags-input.min.css',
          'flat-ui/dist/css/flat-ui.min.css': 'flat-ui/dist/css/flat-ui.min.css',
          'angular-gridster/dist/angular-gridster.min.css': 'angular-gridster/dist/angular-gridster.min.css',

          // JS already minified
          'jquery/dist/jquery.min.js': 'jquery/dist/jquery.min.js',
          'angular/angular.min.js': 'angular/angular.min.js',
          'bootstrap/dist/js/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
          'underscore/underscore-min.js' : 'underscore/underscore-min.js',
          'json3/lib/json3.min.js' : 'json3/lib/json3.min.js',
          'angular-bootstrap/ui-bootstrap.min.js': 'angular-bootstrap/ui-bootstrap.min.js',
          'angular-resource/angular-resource.min.js': 'angular-resource/angular-resource.min.js',
          'angular-route/angular-route.min.js': 'angular-route/angular-route.min.js',
          'angular-sanitize/angular-sanitize.min.js': 'angular-sanitize/angular-sanitize.min.js',
          'angular-animate/angular-animate.min.js': 'angular-animate/angular-animate.min.js',
          'angular-mocks/angular-mocks.js': 'angular-mocks/angular-mocks.js',
          'angular-gridster/dist/angular-gridster.min.js': 'angular-gridster/dist/angular-gridster.min.js',
          'ng-tags-input/ng-tags-input.min.js': 'ng-tags-input/ng-tags-input.min.js',
          'flat-ui/dist/js/flat-ui.min.js': 'flat-ui/dist/js/flat-ui.min.js',

          // JS non-minified
          'fui-angular/fui-template.js': 'fui-angular/fui-template.js',
          'fui-angular/fui-checkbox.js': 'fui-angular/fui-checkbox.js',
          'fui-angular/fui-radio.js': 'fui-angular/fui-radio.js',
          'fui-angular/fui-switch.js': 'fui-angular/fui-switch.js',
          'fui-angular/fui-tpls.js': 'fui-angular/fui-tpls.js'
        }
      }
    },

    // css purify the shit out of all css files
    purifycss: {
      options: {},
      target: {
        src: ['App/index.html', 'App/views/*.html', 'App/templates/*.html', 'App/template/*.html'],
        css: ['App/styles/*.css'],
        dest: 'Build/css/pinbored-webkit.purified.css'
      },
    },

    // then minify those css files
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          processImport : true,
          // src: ['App/styles/*.css', 'App/bower_components_dist/*.css', '!*.min.css'],
          src:  'Build/css/pinbored-webkit.purified.css',
          dest: 'Build/css/pinbored-webkit.min.css',
        }]
      }
    },

    // concatenate and mangle javascript files
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      everything: {
        files: [{
          src: ['App/scripts/app.js', 'App/scripts/**/*.js', '!App/scripts/tests/*.js', '!*.min.js'],
          dest: 'Build/js/pinbored-webkit.min.js'
        }]
      }
    },

    // copy App folder to App_release
    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          // src: ['App/bower_components_dist/**'], 
          {expand: true, cwd: 'App/bower_components_dist/', src: ['**'], dest: 'App_release/bower_components_dist'},
          {expand: true, cwd: 'App/fonts/', src: ['**'], dest: 'App_release/fonts'},
          {expand: true, cwd: 'App/images/', src: ['**'], dest: 'App_release/images'},
          {expand: true, cwd: 'App/node_modules/', src: ['**'], dest: 'App_release/node_modules'},
          {expand: true, cwd: 'App/template/', src: ['**'], dest: 'App_release/template'},
          {expand: true, cwd: 'App/templates/', src: ['**'], dest: 'App_release/templates'},
          {expand: true, cwd: 'App/views/', src: ['**'], dest: 'App_release/views'},
          // minified and concatenated CSS / JS files:
          {expand: false, src: 'Build/css/pinbored-webkit.min.css', dest: 'App_release/pinbored-webkit.min.css'},
          {expand: false, src: 'Build/js/pinbored-webkit.min.js', dest: 'App_release/pinbored-webkit.min.js'},
          // main app files
          {expand: false, src: 'App/index.min.html', dest: 'App_release/index.html'},
          {expand: false, src: 'App/package.json', dest: 'App_release/package.json'}
        ],
      },
    },
  
    // karma settings, conf.js file
    karma : {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    // open karma testing report
    open : {
      report : {
        path : 'karma.report.html',
        app: 'Google Chrome'
      }
    },

    // codeclimate coverage lcov.info
    shell: {
      codeclimate: {
        multiple: {
          command: [
            'export CODECLIMATE_REPO_TOKEN=10daff674413d0c7f0a4a4c177db01e8215217c74c23ec408dc4325e7ece27ca',
            'codeclimate < coverage/lcov.info'
          ].join('&&')
        }
      }
    },

    // building native binaries
    nodewebkit: {
      
      buildOsx : {
        options: {
          platforms: ['osx32', 'osx64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          macCredits: './Resources/pinbored-credits.html',
          macIcns: './Resources/pinbored-icon.icns',
          // macZip: 'false', // set to false (speedup) by default
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App_release/**/*'] // Your node-webkit app
      },

      buildWin : {
        options: {
          platforms: ['win32', 'win64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          // winIco: 'null',
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App_release/**/*'] // Your node-webkit app
      },

      buildLin : {
        options: {
          platforms: ['linux32', 'linux64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          buildDir: './Build', // Where the build version of my node-webkit app is saved
        },
        src: ['./App_release/**/*'] // Your node-webkit app
      }

    }
    
  });

  // Load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  // updating task(s)
  grunt.registerTask('update', ['clean', 'bowercopy']);

  // build, minify, compression etc. task(s)
  grunt.registerTask('build', ['clean', 'bowercopy', 'purifycss', 'cssmin', 'uglify', 'copy']);

  // testing task(s)
  grunt.registerTask('test', 'runs testing, shows report, generates coverage', function () {
    var tasks = ['karma', 'open:report', 'shell:codeclimate'];
    // Use the force option for all tasks declared in the previous line
    grunt.option('force', true);
    grunt.task.run(tasks);
  });

  // build release node-webkit task(s)
  grunt.registerTask('release-all', ['nodewebkit:buildOsx', 'nodewebkit:buildWin', 'nodewebkit:buildLin']);

  grunt.registerTask('release-osx', ['nodewebkit:buildOsx']);
  grunt.registerTask('release-win', ['nodewebkit:buildWin']);
  grunt.registerTask('release-lin', ['nodewebkit:buildLin']);

  // grunt.registerTask('default', ['test', 'osx']);
  grunt.registerTask('default', ['test', 'release-osx']);

};