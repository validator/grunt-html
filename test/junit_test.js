'use strict';

var reporter = require( '../lib/reporters/junit' );
var expectedResults = require( './support/expected_results' );
var path = require( 'path' );

exports.junit = {
  'junit reporter': {
    'when given empty result': function( test ) {
      var result = [],
        // filename = path.normalize( 'test/invalid.html' ),
        expected = [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<testsuite name="htmllint" tests="0" failures="0" errors="0">',
          '</testsuite>'
        ].join( '\n' ),
        actual = reporter( result );
      test.equal( actual, expected, 'Should return empty JUnit XML for empty result' );
      test.done();
    },
    'when given non-empty result': function( test ) {
      var result = expectedResults.invalid,
        filename = path.normalize( 'test/invalid.html' ),
        expected = [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<testsuite name="htmllint" tests="1" failures="0" errors="4">',
          '<testcase name="' + filename + '">',
          '<error message="4 Errors">',
          '1 line 1, char 16: Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”.',
          '2 line 9, char 96: Attribute “unknownattr” not allowed on element “img” at this point.',
          '3 line 9, char 96: An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
          '4 line 11, char 19: The “clear” attribute on the “br” element is obsolete. Use CSS instead.',
          '</error>',
          '</testcase>',
          '</testsuite>'
        ].join( '\n' ),
        actual = reporter( result );
      test.equal( actual, expected, 'Should report errors as JUnit XML' );
      test.done();
    }
  }
};
