/*
 * grunt-html
 * https://github.com/jzaefferer/grunnt-html
 *
 * Copyright (c) 2012 Jörn Zaefferer
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.file.src);
    grunt.helper('htmllint', files, function(error, result) {
      if (error) {
        grunt.log.error(error);
        done(false);
        return;
      }
      if (!result.length) {
        grunt.log.writeln(files.length + ' file(s) valid');
        done();
        return;
      }
      grunt.log.writeln(result.join('\n'));
      done(false);
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('htmllint', function(files, done) {
    var jar = __dirname + '/../vnu.jar';
    grunt.utils.spawn({
      cmd: 'java',
      args: ['-Dnu.validator.client.quiet=yes',  '-jar', jar].concat(files)
    }, function(error, output) {
      if (error) {
        done(error);
        return;
      }
      var result = [];
      if (output.stdout) {
        result = output.stdout.split('\n');
      }
      done(null, result);
    });
  });

};
