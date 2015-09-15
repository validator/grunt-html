/*
 * grunt-html
 * https://github.com/jzaefferer/grunt-html
 *
 * Copyright Jörn Zaefferer
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var htmllint = require('../lib/htmllint');
var reporters = require('../lib/reporters');

module.exports = function(grunt) {

  grunt.registerMultiTask('htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand(this.filesSrc),
      options = this.options({
        wrapPath: '',
        files: files,
        force: false,
        absoluteFilePathsForReporter: false
      }),
      force = options.force,
      reporterOutput = options.reporterOutput,
      reporter,
      lineOffset = 0,
      partialTmpDir = '.tmp-grunt-html';

    function wrapPartials() {
      var wrapTpl = grunt.file.read(options.wrapPath);
      var content;
      var path;
      wrapTpl = wrapTpl.split('<!-- CONTENT -->');
      lineOffset = wrapTpl[0].split(/\n/).length - 1;
      options.$wrap = {lineOffset: lineOffset, tmpDir: partialTmpDir, files: {}};
      options.files = [];
      //grunt.log.ok('lineOffset ' + lineOffset);
      for(var i = 0; i < files.length; i += 1) {
        path = partialTmpDir + '/' + files[i].replace(/^(\.\.\/)+/, '');
        content = wrapTpl[0] + grunt.file.read(files[i]) + wrapTpl[1];
        grunt.file.write(path, content);
        options.$wrap.files[path] = files[i];
        options.files.push(path);
      }
    }

    if (options.wrapPath) {
      wrapPartials();
    }

    htmllint(options, function(error, result) {
      var passed = true,
        output,
        uniqueFiles;

      try {
        reporter = reporters.selectReporter(options);
      } catch (err) {
        grunt.fatal(err);
      }

      if (error) {
        passed = force;
        grunt.log.error(error);
      } else if (!result.length) {
        grunt.log.ok(files.length + ' ' + grunt.util.pluralize(files.length, 'file/files') + ' lint free.');
      } else {
        passed = force;
        output = reporter(result);
        if (!reporterOutput) {
          grunt.log.writeln(output);
        }
        uniqueFiles = result
          .map(function(elem) {
            return elem.file;
          })
          .filter(function(file, index, resultFiles) {
            return resultFiles.indexOf(file) === index;
          });
        grunt.log.error(files.length + ' ' + grunt.util.pluralize(files.length, 'file/files') + ' checked, ' +
                        result.length + ' ' + grunt.util.pluralize(result.length, 'error/errors') + ' in ' +
                        uniqueFiles.length + ' ' + grunt.util.pluralize(uniqueFiles.length, 'file/files'));
      }

      // Write the output of the reporter if wanted
      if (reporterOutput && result.length > 0) {
        reporterOutput = grunt.template.process(reporterOutput);
        var destDir = path.dirname(reporterOutput);
        if (!grunt.file.exists(destDir)) {
          grunt.file.mkdir(destDir);
        }
        grunt.file.write(reporterOutput, output);
        grunt.log.ok('Report "' + reporterOutput + '" created.');
      }

      grunt.file.delete(partialTmpDir);

      done(passed);
    });
  });

};
