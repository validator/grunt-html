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
      mkdirp = require('mkdirp'),
      path = require('path');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('htmlmin', 'Minify html files with kangax html-minifier.', function() {
    var files = [],
        dest = '',
        destMap = [],
        destPath = '',
        destinationIsFile = false;

    // check if config is valid
    if (grunt.utils._.isString(this.file.dest) === false) {
      grunt.fatal('Please specify the destination property (must be a string)');
    }

    if (grunt.utils._.isArray(this.file.src) === false && grunt.utils._.isString(this.file.src) === false) {
      grunt.fatal('Please specify the source property (must be a string or an array)');
    }

    // assign config
    dest = this.file.dest;
    files = grunt.file.expandFiles(this.file.src)
    
    // resolve the destination path (first try windows pathseparators, then *nix)
    destMap = dest.split('\\');
    if (destMap.length === 1) {
      destMap = destMap[0].split('/');
    }

    // check if the destination property is a file
    if (String(path.extname(path.basename(path.normalize(dest)))).trim() !== '') {
      destinationIsFile = true;
    }

    // check if we have multiple files and a file destination
    if (destinationIsFile === true && files.length > 1) {
      grunt.fatal('Found multiple files to minfiy but only one file specified in the dest property. Please use a directory as a destination path, or specify one file to be minified.');
    }

    // Write minified source files.
    var minifiedFiles = grunt.helper('htmlmin', files, grunt.config('htmlminifier'));
    grunt.utils._.each(files, function (src, idx) {
      // resolve the path (first try windows path separators, then *nix)
      var path = [], 
          destinationPath = [], 
          fileContents = grunt.file.read(files[idx]),
          file;
      
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

      // extract the destination file name if destination property is a file
      if (destinationIsFile === true) {
        destinationPath.pop();
      }

      // generate the destination path recursive
      destPath = destinationPath.join('/');
      mkdirp.sync(destPath, 0777);
      
      // write out the minified file
      grunt.log.writeln('File "' + destPath + '/' + file + '" created.');
      grunt.file.write(destPath + '/' + file, minifiedFiles[idx]);
      grunt.helper('min_max_info', minifiedFiles[idx], fileContents);
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('htmlmin', function(srcFiles, options) {
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