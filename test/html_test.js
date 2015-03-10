'use strict';

var path = require('path');
var htmllint = require('../lib/htmllint');
var expectedResults = require('./support/expected_results');

function run(test, config, expected, message) {
  test.expect(1);
  // tests here
  htmllint(config, function(error, result) {
    if (error) {
      throw error;
    }
    // copy only the properties we want to test
    // url property is absolute, system-dependend path
    result = result.map(function(msg) {
      return {
        file: msg.file,
        type: msg.type,
        message: msg.message,
        lastLine: msg.lastLine,
        lastColumn: msg.lastColumn
      };
    });
    test.deepEqual(result, expected, message);
    test.done();
  });
}

exports.htmllint = {
  'all': {
    'with relative paths': function(test) {
      var expected = expectedResults.invalid;
      run(test, {
        files: ['test/valid.html', 'test/invalid.html']
      }, expected, 'four errors from test/invalid.html');
    },
    'with absolute paths': function(test) {
      var expected = expectedResults.invalid.map(function(result) {
        return {
          file: path.resolve(result.file),
          type: result.type,
          message: result.message,
          lastLine: result.lastLine,
          lastColumn: result.lastColumn
        };
      });
      run(test, {
        files: ['test/valid.html', 'test/invalid.html'],
        absoluteFilePathsForReporter: true
      }, expected, 'four errors from test/invalid.html');
    }
  },
  'ignore': function(test) {
    run(test, {
      ignore: [
        'The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
        'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        /attribute “[a-z]+” not allowed/i
      ],
      files: ['test/valid.html', 'test/invalid.html']
    }, [
      {
        lastLine: 9,
        lastColumn: 96,
        type: 'error',
        message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        file: path.join('test', 'invalid.html')
      }
    ], 'one error from test/invalid.html, other three were ignored');
  }
};
