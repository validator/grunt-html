module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    htmllint: {
      valid: "test/valid.html",
      invalid: "test/*.html"
    },
    test: {
      files: ['test/**/*.js']
    },
    jshint: {
      files: ['Grunfile.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'jshint');

};
