'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    htmllint: {
      valid: 'test/valid.html',
      invalid: 'test/*.html',
      ignore: {
        options: {
          ignore: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.'
        },
        src: 'test/*.html'
      },
      invalidPhp: {
        options: {
          ignore: /XML processing instructions/
        },
        src: 'test/*.php'
      },
      checkstyle: {
        options: {
          reporter: 'checkstyle'
        },
        src: 'test/*.html'
      },
      json: {
        options: {
          reporter: 'json'
        },
        src: 'test/*.html'
      }
    },
    nodeunit: {
      files: ['test/**/*.js', '!test/support/**/*.js']
    },
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('default', 'test');

};
