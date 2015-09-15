/*
 * grunt-html
 * https://github.com/jzaefferer/grunt-html
 *
 * Copyright Jörn Zaefferer
 * Licensed under the MIT license.
 */

'use strict';

var path = require( 'path' );
var htmllint = require( '../lib/htmllint' );
var partials = require( '../lib/partials' );
var reporters = require( '../lib/reporters' );

module.exports = function( grunt ) {

  grunt.registerMultiTask( 'htmllint', 'Validate html files', function() {
    var done = this.async(),
      files = grunt.file.expand( this.filesSrc ),
      options = this.options({
        layout: '',
        files: files,
        force: false,
        absoluteFilePathsForReporter: false,
        errorlevels: [ 'info', 'warning', 'error' ]
      }),
      force = options.force,
      reporterOutput = options.reporterOutput,
      reporter,
      layoutData;

    if ( options.layout ) {
      layoutData = {
        partialPath: options.layout,
        lineOffset: 0,
        tmpOutputDir: '.tmp-grunt-html'
      };
      partials( grunt, options, layoutData );
    }

    htmllint( options, function( error, result ) {
      var passed = true,
        output,
        uniqueFiles;

      try {
        reporter = reporters.selectReporter( options );
      } catch ( err ) {
        grunt.fatal( err );
      }

      if ( error ) {
        passed = force;
        grunt.log.error( error );
      } else if ( !result.length ) {
        grunt.log.ok( files.length + ' ' + grunt.util.pluralize( files.length, 'file/files' ) + ' lint free.' );
      } else {
        passed = force;

        output = reporter( result, options );
        if ( !reporterOutput ) {
          grunt.log.writeln( output );
        }
        uniqueFiles = result
          .map(function( elem ) {
            return elem.file;
          })
          .filter(function( file, index, resultFiles ) {
            return resultFiles.indexOf( file ) === index;
          });
        grunt.log.error( files.length + ' ' + grunt.util.pluralize( files.length, 'file/files' ) + ' checked, ' +
          result.length + ' ' + grunt.util.pluralize( result.length, 'error/errors' ) + ' in ' +
          uniqueFiles.length + ' ' + grunt.util.pluralize( uniqueFiles.length, 'file/files' ) );
      }

      // Write the output of the reporter if wanted
      if ( reporterOutput && result.length > 0 ) {
        reporterOutput = grunt.template.process( reporterOutput );
        var destDir = path.dirname( reporterOutput );
        if ( !grunt.file.exists( destDir ) ) {
          grunt.file.mkdir( destDir );
        }
        grunt.file.write( reporterOutput, output );
        grunt.log.ok( 'Report "' + reporterOutput + '" created.' );
      }

      if ( layoutData ) {
        grunt.file.delete( layoutData.tmpOutputDir );
      }

      done( passed );
    });
  });

};
