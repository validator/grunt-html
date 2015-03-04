/*
 * grunt-html
 * https://github.com/jzaefferer/grunt-html
 *
 * Copyright Jörn Zaefferer
 * Licensed under the MIT license.
 */

'use strict';

var htmllint = require('../lib/htmllint');

module.exports = function(grunt) {

  var chalk = require('chalk');

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.filesSrc),
      options = this.options({
        files: files,
        force: false
      }),
      force = options.force;

    htmllint(options, function(error, result) {
      if (error) {
        grunt.log.error(error);
        done(force);
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
      done(force);
    });
  });

};
