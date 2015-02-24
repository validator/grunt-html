/*
 * grunt-html
 * https://github.com/jzaefferer/grunt-html
 *
 * Copyright Jörn Zaefferer
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var chalk = require('chalk');
var hooker = require('hooker');
var htmllint = require('../lib/htmllint');

module.exports = function(grunt) {

  var usingDefaultReporter,

    // Default Grunt reporter
    defaultReporter = function(result) {
      result.forEach(function(message) {
        var output = chalk.cyan(message.file) + ' ';
        output += chalk.red('[') + chalk.yellow('L' + message.lastLine) +
          chalk.red(':') + chalk.yellow('C' + message.lastColumn) + chalk.red('] ');
        output += message.message;
        grunt.log.writeln(output);
      });
    },

    // Select a reporter (if not using the default Grunt reporter)
    selectReporter = function(options) {
      switch (true) {
        // Checkstyle (XML) reporter
        case options.reporter === 'checkstyle':
          options.reporter = '../lib/reporters/checkstyle.js';
          break;

        // Custom reporter
        case options.reporter != null:
          options.reporter = path.resolve(process.cwd(), options.reporter);
      }

      var reporter;
      if (options.reporter) {
        try {
          reporter = require(options.reporter).reporter;
          usingDefaultReporter = false;
        } catch (err) {
          grunt.fatal(err);
        }
      }

      if (!reporter) {
        reporter = defaultReporter;
        usingDefaultReporter = true;
      }

      return reporter;
    };

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.filesSrc),
      options = this.options({
        files: files,
        force: false
      }),
      force = options.force,
      reporter = selectReporter(options),
      reporterOutput = options.reporterOutput,
      output;

    // Hook into stdout to capture report
    if (reporterOutput) {
      output = '';
      hooker.hook(process.stdout, 'write', {
        pre: function(out) {
          output += out;
          return hooker.preempt();
        }
      });
    }

    htmllint(options, function(error, result) {
      var passed = true;
      if (error) {
        passed = force;
        grunt.log.error(error);
      }
      else if (!result.length) {
        if (usingDefaultReporter) {
          grunt.log.ok(files.length + ' ' + grunt.util.pluralize(files.length, 'file/files') + ' lint free.');
        }
      } else {
        passed = force;
        reporter(result);
        if (usingDefaultReporter) {
          grunt.log.error(result.length + ' ' + grunt.util.pluralize(result.length, 'error/errors') + ' in ' +
                          files.length + ' ' + grunt.util.pluralize(files.length, 'file/files'));
        }
      }

      // Write the output of the reporter if wanted
      if (reporterOutput) {
        hooker.unhook(process.stdout, 'write');
        reporterOutput = grunt.template.process(reporterOutput);
        var destDir = path.dirname(reporterOutput);
        if (!grunt.file.exists(destDir)) {
          grunt.file.mkdir(destDir);
        }
        grunt.file.write(reporterOutput, output);
        grunt.log.ok('Report "' + reporterOutput + '" created.');
      }

      done(passed);
    });
  });

};
