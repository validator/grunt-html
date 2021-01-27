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
        src: 'test/fixtures/*.html'
      },
      invalidPhp: {
        options: {
          ignore: /XML processing instructions/
        },
        src: 'test/fixtures/*.php'
      },
      checkstyle: {
        options: {
          reporter: 'checkstyle'
        },
        src: 'test/fixtures/*.html'
      },
      json: {
        options: {
          reporter: 'json'
        },
        src: 'test/fixtures/*.html'
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('test', 'htmllint');
  grunt.registerTask('default', 'test');
};
