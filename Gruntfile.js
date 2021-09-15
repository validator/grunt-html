'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    htmllint: {
      valid: 'test/fixtures/valid.html',
      invalid: 'test/fixtures/*.html',
      manyFiles: 'test/fixtures/many-files/*.html',
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
        src: 'test/fixtures/no-doctype.html'
      },
      jsonReporterOutput: {
        options: {
          reporter: 'json',
          reporterOutput: '.tmp/reporterOutput.json'
        },
        src: 'test/fixtures/no-doctype.html'
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('test', 'htmllint');
  grunt.registerTask('ci', [
    'htmllint:valid',
    'htmllint:json',
    'htmllint:jsonReporterOutput'
  ]);
  grunt.registerTask('default', 'test');
};
