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

  var chalk = require('chalk');

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
        result.forEach(function(message) {
          var output = chalk.cyan(message.file) + ' ';
          output += chalk.red('[') + chalk.yellow('L' + message.lastLine) +
            chalk.red(':') + chalk.yellow('C' + message.lastColumn) + chalk.red('] ');
          output += message.message;
          grunt.log.writeln(output);
        });
      }
      done(false);
    });
  });

};
