'use strict';

var path = require('path');
var testCase  = require('nodeunit').testCase;
var checkstyle = require('../lib/reporters/checkstyle');

exports.reporters = testCase({
  'checkstyle reporter': testCase({
    'when given empty result': function(test) {
      var result = [],
        reporter = checkstyle.reporter,
        expected = '<?xml version="1.0" encoding="utf-8"?><checkstyle>\n</checkstyle>',
        actual = reporter(result);
      test.equal(actual, expected, 'Should return empty checkstyle XML for empty result');
      test.done();
    },
    'when given non-empty result': function(test) {
      var invalid_html = path.join('test', 'invalid.html'),
        result = [{
          lastLine: 1,
          lastColumn: 16,
          type: 'error',
          message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          file: invalid_html
        }, {
          lastLine: 9,
          lastColumn: 96,
          type: 'error',
          message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
          file: invalid_html
        }],
        reporter = checkstyle.reporter,
        expected = [
          '<?xml version="1.0" encoding="utf-8"?><checkstyle>',
          '\t<file name="test/invalid.html">',
          '\t\t<error line="1" column="16" severity="error" message="Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”." source="Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”." />',
          '\t\t<error line="9" column="96" severity="error" message="Attribute “unknownattr” not allowed on element “img” at this point." source="Attribute “unknownattr” not allowed on element “img” at this point." />',
          '\t</file>',
          '</checkstyle>'
        ].join("\n"),
        actual = reporter(result);
      test.equal(actual, expected, 'Should report errors as checkstyle XML');
      test.done();
    }
  })
});
