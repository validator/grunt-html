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
      files = grunt.file.expand(this.filesSrc);

    htmllint(grunt, files, function(error, result) {
      if (error) {
        grunt.log.error(error);
        done(false);
        return;
      }
      if (!result.length) {
        grunt.log.ok(files.length + ' file' + (files.length === 1 ? '' : 's') + ' lint free.');
        done();
        return;
      } else {
        var parts = [], loc = [];
        for (var i = 0, l = result.length; i < l; i++) {
          parts = result[i].split(':'); // 0=file, 1=line, 2=error, 3=msg
          
          if (parts.length < 4) {
            parts.splice(1, 0, '--.--.--');
          }
          loc = parts[1].split('.');
          grunt.log.writeln('Linting ' + parts[0].replace('"', '') + '...' + (parts[2].toUpperCase()).red);
          grunt.log.writeln('['.red + ('L' + loc[0]).yellow + ':'.red + ('C' + loc[2]).yellow + ']'.red + (parts[3]).yellow);
        }
      }
      done(false);
    });
  });

};
