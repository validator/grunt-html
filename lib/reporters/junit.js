/*
 * Author: Iestyn Polley
 * https://github.com/iestyn
 */

'use strict';

module.exports = function( results ) {
  var path = require( 'path' ),
    files = {},
    out = [],
    pairs = {
      '&': '&amp;',
      '"': '&quot;',
      '\'': '&apos;',
      '<': '&lt;',
      '>': '&gt;'
    };

  function encode( s ) {
    for ( var r in pairs ) {
      if ( typeof s !== 'undefined' ) {
        s = s.replace( new RegExp( r, 'g' ), pairs[ r ] );
      }
    }
    return s || '';
  }

  results.forEach(function( result ) {
    // Register the file
    result.file = path.normalize( result.file );
    if ( !files[ result.file ] ) {
      files[ result.file ] = [];
    }

    // Add the error
    files[ result.file ].push({
      severity: result.type,
      line: result.lastLine,
      column: result.lastColumn,
      message: result.message,
      source: 'htmllint.Validation' + ( result.type === 'error' ? 'Error' : 'Warning' )
    });

  });

  out.push( '<?xml version="1.0" encoding="utf-8"?>\n<testsuite name="htmllint" tests="' + Object.keys( files ).length + '" failures="0" errors="' + results.length + '">' );

  for ( var fileName in files ) {
    if ( files.hasOwnProperty( fileName ) ) {
      out.push( '<testcase name="' + fileName + '">\n<error message="' + files[ fileName ].length + ' Errors">' );
      for ( var i = 0; i < files[ fileName ].length; i++ ) {
          var issue = files[ fileName ][ i ];
          out.push(
            ( i + 1 ) + ' ' +
            'line ' + issue.line + ', ' +
            'char ' + issue.column + ': ' +
            encode( issue.message )
         );
      }
      out.push( '</error>\n</testcase>' );
    }
  }

  out.push( '</testsuite>' );

  return out.join( '\n' );
};
