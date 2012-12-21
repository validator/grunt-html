/*
 * grunt-html
 * https://github.com/jzaefferer/grunnt-html
 *
 * Copyright (c) 2012 Jörn Zaefferer
 * Licensed under the MIT license.
 */

var htmllint = require('../lib/htmllint');

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.file.src);

    htmllint(grunt, files, function(error, result) {
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

};
