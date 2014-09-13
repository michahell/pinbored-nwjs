module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodewebkit: {
      options: {
        platforms: ['win', 'osx', 'linux32', 'linux64'],
        buildDir: './Build', // Where the build version of my node-webkit app is saved
      },
      src: ['./App/**/*'] // Your node-webkit app
    }
  });

  // Load the plugin that provides the "nodewebkit" task.
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  // Default task(s).
  grunt.registerTask('default', ['nodewebkit']);

};