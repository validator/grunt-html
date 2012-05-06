/*
 * grunt-html
 * https://github.com/jzaefferer/grunt-html
 *
 * Copyright (c) 2012 Sebastian Golasch
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // External libs.
  var minify = require('html-minifier').minify,
      wrench = require('mkdirp');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('htmlmin', 'Minify html files with kangax html-minifier.', function() {
    var files = grunt.file.expandFiles(this.file.src),
        dest = this.file.dest,
        destMap = [],
        destPath = '';

    // resolve the destination path (first try windows pathseparators, then *nix)
    destMap = dest.split('\\');
    if (destMap.length === 1) {
      destMap = destMap[0].split('/');
    }

    // Write minified source files.
    var minifiedFiles = grunt.helper('htmlmin', files, dest, grunt.config('htmlminifier'));
    grunt.utils._.each(files, function (src, idx) {
      // resolve the path (first try windows pathseparators, then *nix)
      var path = [], destinationPath = [], file;
      path = files[idx].split('\\');
      if (path.length === 1) {
        path = path[0].split('/');
      }

      // remove the first path element
      if (path.length >= 1) {
        path.shift();
      }

      // merge destination and src paths
      destinationPath = destinationPath.concat(destMap);
      destinationPath = destinationPath.concat(path);
      
      // extract the file name
      file = destinationPath.pop();

      // generate the destination path recursive
      destPath = destinationPath.join('/');
      mkdirp.sync(destPath, 0777);
      
      // write out the minified file
      grunt.log.writeln('File "' + destPath + '/' + file + '" created.');
      grunt.file.write(destPath + '/' + file, minifiedFiles[idx]);
      grunt.helper('min_max_info', minifiedFiles[idx], grunt.file.read(files[idx]));
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('htmlmin', function(srcFiles, dest, options) {
    var files = String(srcFiles).split(','),
        minifiedFiles = [];
    if (!options) { options = {}; }
    var msg = 'Minifying with html-minifier...';
    grunt.verbose.write(msg);
    try {
      grunt.utils._.each(files, function (src) {
        minifiedFiles.push(minify(grunt.file.read(src), options));
      });
      // Success!
      grunt.verbose.ok();
      return minifiedFiles;
    } catch(e) {
      // Something went wrong.
      grunt.warn(e.toString());
	    grunt.warn('html-minifier found errors.', 10);
    }
  });

};