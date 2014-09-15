module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    nodewebkit: {
      
      buildOsx : {
        options: {
          platforms: ['osx'],
          buildType: 'versioned', // [appName] -v[appVersion]
          // macCredits: 'false',
          // macIcns: 'false',
          // macZip: 'true',
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

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    open : {
      report : {
        path : 'karma.report.html',
        app: 'Google Chrome'
      }
    }

  });

  // Load the plugin that provides the "nodewebkit" task.
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');

  // Default task(s)
  grunt.registerTask('default', ['karma', 'open:report', 'nodewebkit:buildOsx', 'nodewebkit:buildWin', 'nodewebkit:buildLin32', 'nodewebkit:buildLin64']);

  // testing task(s)
  // grunt.registerTask('test', ['karma', 'open:report']);
  grunt.registerTask('test', 'runs testing and shows report', function () {
    var tasks = ['karma', 'open:report'];
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

};