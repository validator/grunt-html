module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    htmllint: {
      valid: 'test/valid.html',
      force: {
        options: {
          force: true
        },
        src: 'test/*.html'
      },
      ignore: {
        options: {
          ignore: [
            'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
            'Attribute “unknownattr” not allowed on element “img” at this point.',
            'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
            'The “clear” attribute on the “br” element is obsolete. Use CSS instead.'
          ]
        },
        src: 'test/*.html'
      }
    },

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

  grunt.registerTask('default', ['jshint', 'nodeunit', 'htmllint']);
  grunt.registerTask('test', 'default');

};
