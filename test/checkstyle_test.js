'use strict';

const assert = require('assert').strict;
const path = require('path');
const reporter = require('../lib/reporters/checkstyle.js');
const expectedResults = require('./helpers/expected_results.js');

describe('checkstyle reporter', () => {
  it('when given empty result', done => {
    const result = [];
    const expected = '<?xml version="1.0" encoding="utf-8"?><checkstyle>\n</checkstyle>';
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should return empty checkstyle XML for empty result');
    done();
  });

  it('when given non-empty result', done => {
    const result = expectedResults.invalid;
    const filename = path.normalize('test/fixtures/invalid.html');
    const expected = [
      '<?xml version="1.0" encoding="utf-8"?><checkstyle>',
      `\t<file name="${filename}">`,
      '\t\t<error line="1" column="16" severity="error" message="Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”." source="htmllint.ValidationError" />',
      '\t\t<error line="9" column="96" severity="error" message="Attribute “unknownattr” not allowed on element “img” at this point." source="htmllint.ValidationError" />',
      '\t\t<error line="9" column="96" severity="error" message="An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images." source="htmllint.ValidationError" />',
      '\t\t<error line="11" column="17" severity="error" message="The “clear” attribute on the “br” element is obsolete. Use CSS instead." source="htmllint.ValidationError" />',
      '\t</file>',
      '</checkstyle>'
    ].join('\n');
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should report errors as checkstyle XML');
    done();
  });
});
