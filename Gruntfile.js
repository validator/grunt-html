module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    htmllint: {
      valid: "test/valid.html",
      invalid: "test/*.html",
      ignore: {
        options: {
          ignore: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.'
        },
        src: "test/*.html"
      }
    },
    nodeunit: {
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
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['jshint', 'nodeunit']);

};
