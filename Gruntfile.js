
module.exports = function(grunt) {

  // requirements
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
      all: { 
        src: ['App/bower_components_dist', 'App_release', 'Build', 'Release']
      }
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
          'bootstrap/dist/fonts/': 'bootstrap/dist/fonts/',
          'flat-ui/dist/fonts/': 'flat-ui/dist/fonts/',

          // CSS
          'bootstrap/dist/css/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
          'animate.css/animate.min.css': 'animate.css/animate.min.css',
          'ng-tags-input/ng-tags-input.min.css': 'ng-tags-input/ng-tags-input.min.css',
          'flat-ui/dist/css/flat-ui.min.css': 'flat-ui/dist/css/flat-ui.min.css',
          'angular-gridster/dist/angular-gridster.min.css': 'angular-gridster/dist/angular-gridster.min.css',
          'ngprogress/ngProgress.css': 'ngprogress/ngProgress.css',
          'ngDialog/css/ngDialog.min.css': 'ngDialog/css/ngDialog.min.css',
          'ngDialog/css/ngDialog-theme-default.min.css': 'ngDialog/css/ngDialog-theme-default.min.css',
          'ngDialog/css/ngDialog-theme-plain.min.css': 'ngDialog/css/ngDialog-theme-plain.min.css',

          // JS common libs
          'jquery/dist/jquery.min.js': 'jquery/dist/jquery.min.js',
          'bootstrap/dist/js/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
          'underscore/underscore-min.js' : 'underscore/underscore-min.js',
          'json3/lib/json3.min.js' : 'json3/lib/json3.min.js',
          'ramda/dist/ramda.min.js': 'ramda/dist/ramda.min.js',

          // JS angular core
          'angular/angular.min.js': 'angular/angular.min.js',
          'angular-sanitize/angular-sanitize.min.js': 'angular-sanitize/angular-sanitize.min.js',
          'angular-animate/angular-animate.min.js': 'angular-animate/angular-animate.min.js',
          'angular-ui-router/release/angular-ui-router.min.js' : 'angular-ui-router/release/angular-ui-router.min.js',
          'ui-router-extras/release/modular/ct-ui-router-extras.core.min.js' : 'ui-router-extras/release/modular/ct-ui-router-extras.core.min.js',
          'ui-router-extras/release/modular/ct-ui-router-extras.sticky.min.js' : 'ui-router-extras/release/modular/ct-ui-router-extras.sticky.min.js',

          // JS angular additional
          'angular-bootstrap/ui-bootstrap.min.js': 'angular-bootstrap/ui-bootstrap.min.js',
          'angular-gridster/dist/angular-gridster.min.js': 'angular-gridster/dist/angular-gridster.min.js',
          'ng-tags-input/ng-tags-input.min.js': 'ng-tags-input/ng-tags-input.min.js',
          'flat-ui/dist/js/flat-ui.min.js': 'flat-ui/dist/js/flat-ui.min.js',
          'ngprogress/build/ngProgress.min.js': 'ngprogress/build/ngProgress.min.js',
          'ngDialog/js/ngDialog.min.js': 'ngDialog/js/ngDialog.min.js',
          'angular-elastic/elastic.js': 'angular-elastic/elastic.js',
          'mousetrap/mousetrap.min.js': 'mousetrap/mousetrap.min.js',

          // JS angular testing
          'angular-mocks/angular-mocks.js': 'angular-mocks/angular-mocks.js',

          // JS non-minified
          'fui-angular/fui-template.js': 'fui-angular/fui-template.js',
          'fui-angular/fui-checkbox.js': 'fui-angular/fui-checkbox.js',
          'fui-angular/fui-radio.js': 'fui-angular/fui-radio.js',
          'fui-angular/fui-switch.js': 'fui-angular/fui-switch.js',
          'fui-angular/fui-tpls.js': 'fui-angular/fui-tpls.js',

          // JS mappings to minified sourcefiles
          'angular/angular.min.js.map': 'angular/angular.min.js.map',
          'underscore/underscore-min.map' : 'underscore/underscore-min.map',
          'angular-animate/angular-animate.min.js.map': 'angular-animate/angular-animate.min.js.map',
          'angular-sanitize/angular-sanitize.min.js.map': 'angular-sanitize/angular-sanitize.min.js.map',
          'bootstrap/dist/css/bootstrap.min.css.map': 'bootstrap/dist/css/bootstrap.min.css.map'
        }
      }
    },

    // css purify the shit out of all css files
    purifycss: {
      options: {
        info : true,
        rejected : true
      },
      target: {
        src: [
          'App/index.html', 'App/views/*.html', 'App/templates/*.html', 'App/template/*.html',
          'App/scripts/*.js'
        ],
        css: ['App/styles/*.css'],
        dest: 'Build/css/pinbored-nwjs.purified.css'
      },
    },

    // then minify those css files
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      purify : {
        files: [{
          processImport : true,
          // src: ['App/styles/*.css', 'App/bower_components_dist/*.css', '!*.min.css'],
          src:  'Build/css/pinbored-nwjs.purified.css',
          dest: 'Build/css/pinbored-nwjs.min.css',
        }]
      },
      nopurify: {
        files: [{
          processImport : true,
          src: ['App/styles/*.css'],
          dest: 'Build/css/pinbored-nwjs.min.css',
        }]
      }
    },

    preprocess : {
      development : {
        options: {
          context : {
            DEBUG: true
          }
        },
        src : 'App/index.template.html',
        dest : 'App/index.html'
      },
      release : {
        options: {
          context : {
            RELEASE : true
          }
        },
        files : [
          {src : 'App/index.template.html', dest : 'Build/index.min.html' },
          {expand: true, src : 'App/scripts/**/*.js', dest : 'Build' }
        ]
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
          // src: ['App/scripts/app.js', 'App/scripts/**/*.js', '!App/scripts/tests/*.js', '!*.min.js'],
          src: ['Build/App/scripts/app.js', 'Build/App/scripts/**/*.js', '!Build/App/scripts/tests/*.js'],
          dest: 'Build/js/pinbored-nwjs.min.js'
        }]
      }
    },

    htmlclean: {
      options: {
      },
      deploy: {
        files : [
          {expand: true, cwd: 'App/templates/', src: ['*.html'], dest: 'Build/templates' },
          {expand: true, cwd: 'App/template/', src: ['**/*.html'], dest: 'Build/template' },
          {expand: true, cwd: 'App/views/', src: ['**/*.html'], dest: 'Build/views' }
        ]
      }
    },

    // copy App/Build folders to App_release
    copy: {
      all: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'App/bower_components_dist/', src: ['**'], dest: 'App_release/bower_components_dist'},
          {expand: true, cwd: 'App/fonts/', src: ['**'], dest: 'App_release/fonts'},
          {expand: true, cwd: 'App/images/', src: ['**'], dest: 'App_release/images'},
          {expand: true, cwd: 'App/node_modules/', src: ['**'], dest: 'App_release/node_modules'},
          {expand: true, cwd: 'Build/template/', src: ['**'], dest: 'App_release/template'},
          {expand: true, cwd: 'Build/templates/', src: ['**'], dest: 'App_release/templates'},
          {expand: true, cwd: 'Build/views/', src: ['**'], dest: 'App_release/views'},
          // minified and concatenated CSS / JS files:
          {src: 'Build/css/pinbored-nwjs.min.css', dest: 'App_release/pinbored-nwjs.min.css'},
          {src: 'Build/js/pinbored-nwjs.min.js', dest: 'App_release/pinbored-nwjs.min.js'},
          // main app files
          {src: 'Build/index.min.html', dest: 'App_release/index.html'},
          {src: 'App/package.json', dest: 'App_release/package.json'}
        ],
      }
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
    nwjs: {
      
      buildOsx : {
        options: {
          version: 'v0.12.2',
          platforms: ['osx32', 'osx64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          macCredits: './Resources/pinbored-credits.html',
          macIcns: './Resources/pinbored-icon.icns',
          // macZip: 'false', // set to false (speedup) by default
          buildDir: './Release', // Where the build version of my node-webkit app is saved
        },
        src: ['./App_release/**/*'] // Your node-webkit app
      },

      buildWin : {
        options: {
          version: 'v0.12.2',
          platforms: ['win32', 'win64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          // winIco: 'null',
          buildDir: './Release', // Where the build version of my node-webkit app is saved
        },
        src: ['./App_release/**/*'] // Your node-webkit app
      },

      buildLin : {
        options: {
          version: 'v0.12.2',
          platforms: ['linux32', 'linux64'],
          buildType: 'versioned', // [appName] -v[appVersion]
          buildDir: './Release', // Where the build version of my node-webkit app is saved
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
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-htmlclean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-nw-builder');

  // grunt task
  grunt.registerTask('update', ['clean', 'bowercopy', 'preprocess:development']);
  grunt.registerTask('build', ['update', 'cssmin:nopurify', 'preprocess:release', 'uglify', 'htmlclean', 'copy']);

  // testing task(s)
  grunt.registerTask('test', 'runs testing, shows report, generates coverage', function () {
    var tasks = ['karma', 'open:report', 'shell:codeclimate'];
    // Use the force option for all tasks declared in the previous line
    grunt.option('force', true);
    grunt.task.run(tasks);
  });

  // release node-webkit tasks
  grunt.registerTask('release-osx', ['build', 'nwjs:buildOsx']);
  grunt.registerTask('release-win', ['build', 'nwjs:buildWin']);
  grunt.registerTask('release-lin', ['build', 'nwjs:buildLin']);

  grunt.registerTask('default', ['build']);

};