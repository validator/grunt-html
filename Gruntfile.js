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
    eslint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
        configFile: '.eslintrc.json'
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['eslint', 'nodeunit']);
  grunt.registerTask('default', 'test');
};
