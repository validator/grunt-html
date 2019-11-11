'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    vnuserver: {
      options: {
        port: 8877,
        skippable: true
      }
    },
    mochacli: {
      options: {
        require: ['assert'],
        reporter: 'spec',
        bail: false,
        timeout: 10000,
        sort: true,
        files: ['tests/**/*.js']
      },
      local: {
        timeout: 25000
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-vnuserver');
  grunt.registerTask('test', ['vnuserver', 'mochacli:local']);
  grunt.registerTask('default', 'test');
};
