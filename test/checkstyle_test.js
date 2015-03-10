'use strict';

var reporter = require('../lib/reporters/checkstyle');
var expectedResults = require('./support/expected_results');
var path = require('path');

exports.checkstyle = {
  'checkstyle reporter': {
    'when given empty result': function(test) {
      var result = [],
        expected = '<?xml version="1.0" encoding="utf-8"?><checkstyle>\n</checkstyle>',
        actual = reporter(result);
      test.equal(actual, expected, 'Should return empty checkstyle XML for empty result');
      test.done();
    },
    'when given non-empty result': function(test) {
      var result = expectedResults.invalid,
        filename = path.normalize('test/invalid.html'),
        expected = [
          '<?xml version="1.0" encoding="utf-8"?><checkstyle>',
          '\t<file name="' + filename + '">',
          '\t\t<error line="1" column="16" severity="error" message="Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”." source="htmllint.ValidationError" />',
          '\t\t<error line="9" column="96" severity="error" message="Attribute “unknownattr” not allowed on element “img” at this point." source="htmllint.ValidationError" />',
          '\t\t<error line="9" column="96" severity="error" message="An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images." source="htmllint.ValidationError" />',
          '\t\t<error line="11" column="19" severity="error" message="The “clear” attribute on the “br” element is obsolete. Use CSS instead." source="htmllint.ValidationError" />',
          '\t</file>',
          '</checkstyle>'
        ].join('\n'),
        actual = reporter(result);
      test.equal(actual, expected, 'Should report errors as checkstyle XML');
      test.done();
    }
  }
};
