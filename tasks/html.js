/*
 * grunt-html
 * https://github.com/validator/grunt-html
 *
 * Copyright Jörn Zaefferer
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const htmllint = require('../lib/htmllint');
const reporters = require('../lib/reporters');

module.exports = function(grunt) {
  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    const done = this.async();
    const files = grunt.file.expand(this.filesSrc);
    const options = this.options({
      files,
      force: false,
      absoluteFilePathsForReporter: false,
      errorlevels: ['info', 'warning', 'error'],
      noLangDetect: false
    });
    const { force } = options;
    let { reporterOutput } = options;
    let reporter;

    htmllint(options, (error, result) => {
      let passed = true;
      let output;
      let uniqueFiles;

      try {
        reporter = reporters.selectReporter(options);
      } catch (error2) {
        grunt.fatal(error2);
      }

      if (error) {
        passed = force;
        grunt.log.error(error);
      } else if (result.length === 0) {
        grunt.log.ok(`${files.length} ${grunt.util.pluralize(files.length, 'file/files')} lint free.`);
      } else {
        passed = force;
        output = reporter(result);
        if (!reporterOutput) {
          grunt.log.writeln(output);
        }
        uniqueFiles = result
          .map(elem => {
            return elem.file;
          })
          .filter((file, index, resultFiles) => {
            return resultFiles.indexOf(file) === index;
          });
        grunt.log.error(`${files.length} ${grunt.util.pluralize(files.length, 'file/files')} checked, ${result.length} ${grunt.util.pluralize(result.length, 'error/errors')} in ${uniqueFiles.length} ${grunt.util.pluralize(uniqueFiles.length, 'file/files')}`);
      }

      // Write the output of the reporter if wanted
      if (reporterOutput && result.length > 0) {
        reporterOutput = grunt.template.process(reporterOutput);
        const destDir = path.dirname(reporterOutput);

        if (!grunt.file.exists(destDir)) {
          grunt.file.mkdir(destDir);
        }
        grunt.file.write(reporterOutput, output);
        grunt.log.ok(`Report "${reporterOutput}" created.`);
      }

      done(passed);
    });
  });
};
