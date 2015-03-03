module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    nodeunit: {
      files: 'test/*.js'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Grunfile.js', 'lib/*.js', 'tasks/*.js', 'test/*.js']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['jshint', 'nodeunit']);
  grunt.registerTask('test', 'default');

};
