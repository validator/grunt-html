var grunt = require('grunt'),
  htmllint = require('../lib/htmllint');

exports['htmllint'] = {
  'helper': function(test) {
    "use strict";
    test.expect(1);
    // tests here
    htmllint(grunt, ['test/valid.html', 'test/invalid.html'], function(error, result) {
      if (error) {
        throw error;
      }
      // copy only the properties we want to test
      // url property is absolute, system-dependend path
      result = result.map(function(message) {
        return {
          file: message.file,
          message: message.message,
          lastLine: message.lastLine,
          lastColumn: message.lastColumn
        };
      });
      test.deepEqual(result, [
        {
          lastLine: 10,
          lastColumn: 81,
          message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
          file: 'test/invalid.html'
        },
        {
          lastLine: 12,
          lastColumn: 19,
          message: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.',
          file: 'test/invalid.html'
        }
      ], 'two errors from test/invalid.html');
      test.done();
    });
  }
};
